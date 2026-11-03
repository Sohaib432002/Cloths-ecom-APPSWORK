import fs from 'node:fs'
import path from 'node:path'
import { getDb } from '../lib/db/client'

// Usage: npm run db:setup            create the schema and seed it (no-op when already seeded)
//        npm run db:reset            delete the local database file first, then rebuild it
//        npm run db:stats            print row counts

const args = new Set(process.argv.slice(2))

async function main() {
  if (!process.env.TURSO_DATABASE_URL && !process.env.DATABASE_PATH) {
    process.env.DATABASE_PATH = path.join(process.cwd(), 'data', 'veora.db')
  }

  if (args.has('--reset')) {
    if (process.env.TURSO_DATABASE_URL) {
      throw new Error('Refusing to reset a remote Turso database. Drop its tables from the Turso dashboard instead.')
    }
    const file = path.resolve(process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'veora.db'))
    for (const suffix of ['', '-wal', '-shm', '-journal']) fs.rmSync(file + suffix, { force: true })
    console.log(`Removed ${file}`)
  }

  const db = await getDb()
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  for (const row of tables.rows) {
    const name = String(row.name)
    const count = await db.execute(`SELECT COUNT(*) AS n FROM ${name}`)
    console.log(`${name.padEnd(24)} ${count.rows[0].n}`)
  }
  console.log('Database ready.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
