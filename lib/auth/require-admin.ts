import { getAdminUser } from './admin'
import { jsonError } from '@/lib/http'

/** Returns an error response when the caller is not the shop owner, otherwise null. */
export async function denyUnlessAdmin() {
  return (await getAdminUser()) ? null : jsonError('Not found.', 404, 'NOT_FOUND')
}
