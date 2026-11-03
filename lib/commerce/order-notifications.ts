import { emailLayout, escapeHtml, sendEmail, sendSms } from '@/lib/notify'
import { SITE, toE164 } from '@/lib/site'
import { getAppUrl } from '@/lib/env'
import type { OrderRecord } from './orders'

type Order = NonNullable<OrderRecord>

const money = (value: number) => `$${value.toFixed(2)}`

function orderTable(order: Order) {
  const rows = order.items
    .map(
      (item) => `<tr><td style="padding:6px 0">${escapeHtml(item.title)}${item.size ? ` · ${escapeHtml(item.size)}` : ''}${item.color ? ` · ${escapeHtml(item.color)}` : ''} × ${item.quantity}</td>
<td align="right" style="padding:6px 0">${money(item.price * item.quantity)}</td></tr>`
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e9e3fa;border-bottom:1px solid #e9e3fa;margin:16px 0">${rows}
<tr><td style="padding:6px 0;color:#6b6788">Delivery</td><td align="right">${money(order.deliveryFee)}</td></tr>
${order.discount > 0 ? `<tr><td style="padding:6px 0;color:#6b6788">Discount</td><td align="right">-${money(order.discount)}</td></tr>` : ''}
<tr><td style="padding:10px 0;font-weight:700">Total</td><td align="right" style="font-weight:700">${money(order.total)}</td></tr></table>`
}

/** Customer confirmation by email and SMS, plus an alert to the shop owner. Failures never block checkout. */
export async function notifyOrderConfirmed(order: Order) {
  const trackUrl = `${getAppUrl()}/track?order=${order.id}`
  const customerHtml = emailLayout(
    `Thank you, your order ${order.id} is confirmed`,
    `<p style="font-size:14px;line-height:22px">Hi ${escapeHtml(order.address.name)}, we are getting your order ready.</p>
${orderTable(order)}
<p style="font-size:14px;line-height:22px">Payment: ${escapeHtml(order.payment)} (${escapeHtml(order.paymentStatus || '')})<br>
Delivering to: ${escapeHtml(order.address.address)}, ${escapeHtml(order.address.city)}, ${escapeHtml(order.address.country)}</p>
<p><a href="${trackUrl}" style="display:inline-block;background:#7c5cdc;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">Track your order</a></p>`
  )

  const phone = toE164(order.address.phone)
  const tasks: Promise<unknown>[] = [
    sendEmail({ to: order.email || '', subject: `Your Véora order ${order.id}`, html: customerHtml }),
    sendEmail({
      to: SITE.email,
      subject: `New order ${order.id} (${money(order.total)})`,
      html: emailLayout(
        `New order ${order.id}`,
        `${orderTable(order)}<p style="font-size:14px;line-height:22px">${escapeHtml(order.address.name)} · ${escapeHtml(order.address.phone)} · ${escapeHtml(order.email || '')}<br>
${escapeHtml(order.address.address)}, ${escapeHtml(order.address.city)}, ${escapeHtml(order.address.zipCode)}, ${escapeHtml(order.address.country)}<br>
Payment: ${escapeHtml(order.payment)} (${escapeHtml(order.paymentStatus || '')})</p>`
      ),
    }),
    sendSms(SITE.phone, `Véora: new order ${order.id}, ${money(order.total)} from ${order.address.name}.`),
  ]
  if (phone) {
    tasks.push(sendSms(phone, `Véora: thank you! Order ${order.id} (${money(order.total)}) is confirmed. Track it: ${trackUrl}`))
  }
  await Promise.allSettled(tasks)
}

export async function notifyOrderStatus(order: Order) {
  const phone = toE164(order.address.phone)
  const trackUrl = `${getAppUrl()}/track?order=${order.id}`
  await Promise.allSettled([
    sendEmail({
      to: order.email || '',
      subject: `Order ${order.id} is now ${order.status}`,
      html: emailLayout(
        `Your order is ${order.status.toLowerCase()}`,
        `<p style="font-size:14px;line-height:22px">Order ${order.id} has been updated to <strong>${escapeHtml(order.status)}</strong>.</p>
<p><a href="${trackUrl}" style="color:#7c5cdc;font-weight:700">Track your order</a></p>`
      ),
    }),
    phone ? sendSms(phone, `Véora: order ${order.id} is now ${order.status}. ${trackUrl}`) : Promise.resolve(false),
  ])
}
