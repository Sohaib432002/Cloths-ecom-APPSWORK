import { getCurrentUser } from './session'

// Shop owners are listed in ADMIN_EMAILS (comma separated). They must also have a verified account.
export function adminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.SUPPORT_EMAIL || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function getAdminUser() {
  const user = await getCurrentUser()
  if (!user || !user.emailVerified) return null
  return adminEmails().includes(user.email.toLowerCase()) ? user : null
}
