import nodemailer, { type Transporter } from 'nodemailer'
import { SITE } from './site'
import { logEvent } from './http'

// Email goes out through any SMTP account (Gmail app password, Brevo, Resend SMTP...).
// SMS goes out through Twilio. Both are optional: without credentials the message is logged and skipped.

export function emailEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function smsEnabled() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM)
}

let transport: Transporter | null = null

function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465)
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }
  return transport
}

export async function sendEmail(input: { to: string; subject: string; html: string; text?: string; replyTo?: string }) {
  if (!emailEnabled()) {
    logEvent('email.skipped', { to: input.to, subject: input.subject })
    return false
  }
  try {
    const info = await getTransport().sendMail({
      from: process.env.SMTP_FROM || `${SITE.name} <${process.env.SMTP_USER}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    })
    logEvent('email.sent', { to: input.to, subject: input.subject, accepted: info.accepted, rejected: info.rejected, response: info.response })
    return true
  } catch (error) {
    logEvent('email.failed', { to: input.to, reason: error instanceof Error ? error.message : 'unknown' })
    return false
  }
}

export async function sendSms(to: string, body: string) {
  if (!smsEnabled()) {
    logEvent('sms.skipped', { to })
    return false
  }
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID!
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM!, Body: body }),
    })
    if (!response.ok) {
      logEvent('sms.failed', { to, status: response.status })
      return false
    }
    return true
  } catch (error) {
    logEvent('sms.failed', { to, reason: error instanceof Error ? error.message : 'unknown' })
    return false
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

/** Branded, table-based layout so it renders in every mail client. */
export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f0ff;font-family:Arial,Helvetica,sans-serif;color:#1b1540">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#7c5cdc;padding:20px 28px;color:#ffffff;font-size:22px;font-weight:700">${SITE.name}</td></tr>
<tr><td style="padding:28px"><h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:18px 28px;background:#faf8ff;font-size:12px;color:#6b6788">Need help? WhatsApp or call ${SITE.phoneDisplay}, or reply to this email (${SITE.email}).</td></tr>
</table></td></tr></table></body></html>`
}

export { escapeHtml }
