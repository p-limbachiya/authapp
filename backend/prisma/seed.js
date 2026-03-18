import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/db.js'

const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
const password = process.env.SEED_ADMIN_PASSWORD ?? 'password'
const name = process.env.SEED_ADMIN_NAME ?? 'Alice Admin'

async function main() {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      email,
      name,
      role: 'admin',
      passwordHash,
    },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

