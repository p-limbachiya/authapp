import prismaPkg from '@prisma/client'

const { PrismaClient } = prismaPkg

function withDefaultSchema(url) {
  if (!url) return url
  const schema = process.env.DB_SCHEMA ?? 'authapp_rbac'
  if (/schema=/.test(url)) {
    return url.replace(/([?&])schema=[^&]+/i, `$1schema=${encodeURIComponent(schema)}`)
  }
  return url + (url.includes('?') ? '&' : '?') + `schema=${encodeURIComponent(schema)}`
}

const databaseUrl = withDefaultSchema(process.env.DATABASE_URL)

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

