import { jsonOk } from '@/lib/http'
import { getCatalogSummary } from '@/lib/catalog'

export async function GET() {
  return jsonOk({
    service: 'SHOP.CO',
    catalog: getCatalogSummary(),
    auth: {
      login: 'POST /api/auth/login',
      signup: 'POST /api/auth/signup',
      me: 'GET /api/auth/me',
    },
  })
}
