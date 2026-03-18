import fs from 'node:fs'
import { Client } from 'pg'

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
const databaseUrl = env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL missing')

// Connect without forcing search_path; we only need to create schema.
const client = new Client({ connectionString: databaseUrl })
await client.connect()
try {
  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema.replace(/"/g, '""')}"`)
} finally {
  await client.end()
}

