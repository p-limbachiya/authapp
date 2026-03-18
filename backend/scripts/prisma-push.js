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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const fileEnv = fs.existsSync('.env') ? parseDotEnv(fs.readFileSync('.env', 'utf8')) : {}
const env = { ...process.env, ...fileEnv }

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL missing (set it in backend/.env)')
}

const schema = env.DB_SCHEMA ?? 'authapp_rbac'

// Ensure schema exists before pushing.
execSync('node scripts/ensure-schema.js', { stdio: 'inherit', env })

// Always pin Prisma to our schema (additive, isolated).
if (/schema=/.test(env.DATABASE_URL)) {
  env.DATABASE_URL = env.DATABASE_URL.replace(/([?&])schema=[^&]+/i, `$1schema=${encodeURIComponent(schema)}`)
} else {
  env.DATABASE_URL = env.DATABASE_URL + (env.DATABASE_URL.includes('?') ? '&' : '?') + `schema=${encodeURIComponent(schema)}`
}

execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env })

