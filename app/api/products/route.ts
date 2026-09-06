import { getCatalogSummary, searchCatalog } from '@/lib/catalog'
import { queryFromSearchParams } from '@/lib/catalog/query'
import { jsonOk } from '@/lib/http'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = searchCatalog(queryFromSearchParams(searchParams))
  const summary = getCatalogSummary()

  return jsonOk({
    products: result.items,
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
    facets: result.facets,
    summary,
  })
}
