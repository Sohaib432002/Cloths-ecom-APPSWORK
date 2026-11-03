import { getHomeCollections } from '@/lib/catalog'
import { jsonOk } from '@/lib/http'

export async function GET() {
  return jsonOk(await getHomeCollections())
}
