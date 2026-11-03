import bcrypt from 'bcryptjs'
import { getDb } from '../lib/db/client'

// Usage: npm run admin:create -- owner@example.com "StrongPassword1" "Owner Name"
// Creates (or resets the password of) a verified account. Put the same email in ADMIN_EMAILS to grant /admin access.

async function main() {
  const [email, password, fullName = 'Shop Owner'] = process.argv.slice(2)
  if (!email || !password) throw new Error('Usage: npm run admin:create -- <email> <password> [full name]')
  if (password.length < 8) throw new Error('Password must be at least 8 characters.')

  if (!process.env.TURSO_DATABASE_URL && !process.env.DATABASE_PATH) {
    process.env.DATABASE_PATH = `${process.cwd()}/data/veora.db`
  }
  const db = await getDb()
  const [firstName, ...rest] = fullName.split(' ')
  const hash = bcrypt.hashSync(password, 10)
  const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ? COLLATE NOCASE', args: [email] })

  if (existing.rows.length) {
    await db.execute({
      sql: 'UPDATE users SET password_hash = ?, email_verified = 1 WHERE id = ?',
      args: [hash, String(existing.rows[0].id)],
    })
    console.log(`Updated ${email}`)
  } else {
    await db.execute({
      sql: `INSERT INTO users (id, email, first_name, last_name, password_hash, email_verified, created_at)
            VALUES (?, ?, ?, ?, ?, 1, ?)`,
      args: [`usr_${crypto.randomUUID()}`, email.toLowerCase(), firstName, rest.join(' ') || '-', hash, new Date().toISOString()],
    })
    console.log(`Created ${email}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
