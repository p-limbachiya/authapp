import fs from 'node:fs'
import { execSync } from 'node:child_process'

function parseDotEnv(contents) {
  const env = {}
  for (const raw of contents.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 0) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const fileEnv = fs.existsSync('.env') ? parseDotEnv(fs.readFileSync('.env', 'utf8')) : {}
const env = { ...process.env, ...fileEnv }
const schema = env.DB_SCHEMA ?? 'authapp_rbac'

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL missing')
}

// Ensure Prisma runs against our isolated schema (prevents touching public tables).
if (/schema=/.test(env.DATABASE_URL)) {
  env.DATABASE_URL = env.DATABASE_URL.replace(/([?&])schema=[^&]+/i, `$1schema=${encodeURIComponent(schema)}`)
} else {
  env.DATABASE_URL = env.DATABASE_URL + (env.DATABASE_URL.includes('?') ? '&' : '?') + `schema=${encodeURIComponent(schema)}`
}

// 1) Ensure Postgres schema exists (non-destructive)
execSync('node scripts/ensure-schema.js', { stdio: 'inherit', env })

// 2) Sync Prisma schema into that Postgres schema (no generate at runtime)
execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env })

// 3) Start the HTTP server (server imports dotenv/config itself)
await import('../src/index.js')

