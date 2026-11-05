import fs from 'node:fs'
import path from 'node:path'
import { createClient, type Client } from '@libsql/client'
import { SCHEMA, SCHEMA_VERSION } from './schema'
import { seedDatabase } from './seed'

declare global {
  // eslint-disable-next-line no-var
  var __veoraDb: Promise<Client> | undefined
}

function resolveUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL

  // Vercel's filesystem is read-only except /tmp, so a local file only lives as long as the instance.
  const file = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : process.env.VERCEL
      ? '/tmp/veora.db'
      : path.join(process.cwd(), 'data', 'veora.db')

  fs.mkdirSync(path.dirname(file), { recursive: true })

  // build step ships a pre-seeded database; copy it to the writable location on cold start
  const bundled = path.join(process.cwd(), 'data', 'veora.db')
  if (process.env.VERCEL && !fs.existsSync(file) && fs.existsSync(bundled)) {
    fs.copyFileSync(bundled, file)
  }
  return `file:${file.split(path.sep).join('/')}`
}

export function isEphemeralDb() {
  return Boolean(process.env.VERCEL) && !process.env.TURSO_DATABASE_URL && !process.env.DATABASE_PATH
}

async function init() {
  const client = createClient({
    url: resolveUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  await client.execute('PRAGMA foreign_keys = ON')
  await client.batch(SCHEMA, 'write')

  // databases created before a column existed are upgraded in place
  const columns = await client.execute('PRAGMA table_info(products)')
  if (!columns.rows.some((row) => row.name === 'is_active')) {
    await client.execute('ALTER TABLE products ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1')
  }

  if (!columns.rows.some((row) => row.name === 'is_demo')) {
    await client.execute('ALTER TABLE products ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0')
    // everything that exists before this column is the sample catalog the store shipped with
    await client.execute('UPDATE products SET is_demo = 1')
  }

  const current = await client.execute({ sql: "SELECT value FROM meta WHERE key = 'schema_version'" })
  if (!current.rows.length) {
    await client.execute({
      sql: "INSERT INTO meta (key, value) VALUES ('schema_version', ?)",
      args: [String(SCHEMA_VERSION)],
    })
  }

  await seedDatabase(client)
  return client
}

export function getDb(): Promise<Client> {
  if (!globalThis.__veoraDb) {
    globalThis.__veoraDb = init().catch((error) => {
      globalThis.__veoraDb = undefined
      throw error
    })
  }
  return globalThis.__veoraDb
}
