import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { createProduct, listProductsAdmin, productSchema } from '@/lib/admin/products'
import { jsonError, jsonOk, readJson } from '@/lib/http'

export async function GET(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const params = new URL(request.url).searchParams
  return jsonOk(await listProductsAdmin(params.get('q') || '', Number(params.get('page')) || 1))
}

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const parsed = productSchema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Check the product details.', 400, 'VALIDATION')
  try {
    return jsonOk(await createProduct(parsed.data), 201)
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Could not save the product.', 400)
  }
}
