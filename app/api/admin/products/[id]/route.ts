import { z } from 'zod'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getProductAdmin, productSchema, removeProduct, setProductActive, updateProduct } from '@/lib/admin/products'
import { jsonError, jsonOk, readJson } from '@/lib/http'

type Ctx = { params: Promise<{ id: string }> }

async function readId(ctx: Ctx) {
  const id = Number((await ctx.params).id)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function GET(_request: Request, ctx: Ctx) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const id = await readId(ctx)
  const product = id ? await getProductAdmin(id) : null
  return product ? jsonOk({ product }) : jsonError('Product not found.', 404)
}

export async function PUT(request: Request, ctx: Ctx) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const id = await readId(ctx)
  const parsed = productSchema.safeParse(await readJson(request))
  if (!id) return jsonError('Product not found.', 404)
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Check the product details.', 400, 'VALIDATION')
  return (await updateProduct(id, parsed.data)) ? jsonOk({ ok: true }) : jsonError('Product not found.', 404)
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const id = await readId(ctx)
  const parsed = z.object({ active: z.boolean() }).safeParse(await readJson(request))
  if (!id || !parsed.success) return jsonError('Invalid request.', 400)
  return (await setProductActive(id, parsed.data.active)) ? jsonOk({ ok: true }) : jsonError('Product not found.', 404)
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const id = await readId(ctx)
  if (!id) return jsonError('Product not found.', 404)
  return jsonOk({ result: await removeProduct(id) })
}
