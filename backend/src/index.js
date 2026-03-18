import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { prisma } from './db.js'
import { publicUser } from './users.js'
import { issueToken, requireAuth, requireRole, getBearerToken, verifyToken } from './auth.js'

const app = express()

const PORT = Number(process.env.PORT ?? 4000)
const CLIENT_URL = process.env.CLIENT_URL
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
const originsRaw = CLIENT_URL ?? FRONTEND_ORIGIN ?? 'http://localhost:3000'
const ALLOWED_ORIGINS = originsRaw.split(',').map((s) => s.trim()).filter(Boolean)

app.use(
  cors({
    origin: "*",
    credentials: false,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

// Mirrors frontend fakeLogin(): returns { user, token, expiresAt }
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {}

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: 'User not found. Please check your email.', code: 'USER_NOT_FOUND' })
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials. Please try again.', code: 'INVALID_CREDENTIALS' })
  }

  const { token, expiresAt } = issueToken({ userId: user.id, role: user.role })
  return res.json({
    user: publicUser(user),
    token,
    expiresAt,
  })
})

// Used by frontend "restore session" flow (validate token + expiry)
app.post('/auth/validate', (req, res) => {
  const token = getBearerToken(req) ?? req.body?.token
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ valid: false, error: 'Missing token' })
  }

  try {
    verifyToken(token)
    return res.json({ valid: true })
  } catch (e) {
    const code = e?.code === 'SESSION_EXPIRED' ? 'SESSION_EXPIRED' : 'INVALID_TOKEN'
    return res.status(401).json({
      valid: false,
      code,
      error: code === 'SESSION_EXPIRED' ? 'Your session has expired. Please log in again.' : 'Invalid token.',
    })
  }
})

// "who am I"
app.get('/auth/me', requireAuth, (req, res) => {
  prisma.user
    .findUnique({ where: { id: req.auth.userId } })
    .then((user) => {
      if (!user) return res.status(404).json({ error: 'User not found' })
      return res.json({ user: publicUser(user) })
    })
    .catch(() => res.status(500).json({ error: 'Failed to load user' }))
})

// Protected data endpoints to match the UI pages
app.get('/dashboard/stats', requireAuth, (_req, res) => {
  return res.json({
    activeSessions: 3,
    reportsGenerated: 42,
    systemStatus: 'Healthy',
  })
})

app.get('/reports', requireAuth, requireRole(['admin', 'manager']), (_req, res) => {
  return res.json({
    reports: [1, 2, 3, 4].map((id) => ({
      id,
      title: `Report #${id}`,
      summary: `Summary of system activity and performance metrics for report #${id}.`,
    })),
  })
})

// Admin Users CRUD
app.get('/admin/users', requireAuth, requireRole(['admin']), async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
  return res.json({ users: users.map(publicUser) })
})

app.post('/admin/users', requireAuth, requireRole(['admin']), async (req, res) => {
  const { name, email, role, password } = req.body ?? {}
  if (typeof name !== 'string' || typeof email !== 'string' || typeof role !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'name, email, role, password are required' })
  }
  if (!['admin', 'manager', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const created = await prisma.user.create({
      data: { name, email, role, passwordHash },
    })
    return res.status(201).json({ user: publicUser(created) })
  } catch (e) {
    if (String(e?.code ?? '').includes('P2002')) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    return res.status(500).json({ error: 'Failed to create user' })
  }
})

app.put('/admin/users/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  const { name, email, role, password } = req.body ?? {}
  if (typeof name !== 'string' || typeof email !== 'string' || typeof role !== 'string') {
    return res.status(400).json({ error: 'name, email, role are required' })
  }
  if (!['admin', 'manager', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' })

  const data = { name, email, role }
  if (typeof password === 'string' && password.length > 0) {
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    data.passwordHash = await bcrypt.hash(password, 10)
  }

  try {
    const updated = await prisma.user.update({ where: { id }, data })
    return res.json({ user: publicUser(updated) })
  } catch (e) {
    if (String(e?.code ?? '').includes('P2025')) return res.status(404).json({ error: 'User not found' })
    if (String(e?.code ?? '').includes('P2002')) return res.status(409).json({ error: 'Email already exists' })
    return res.status(500).json({ error: 'Failed to update user' })
  }
})

app.delete('/admin/users/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  try {
    await prisma.user.delete({ where: { id } })
    return res.status(204).end()
  } catch (e) {
    if (String(e?.code ?? '').includes('P2025')) return res.status(404).json({ error: 'User not found' })
    return res.status(500).json({ error: 'Failed to delete user' })
  }
})

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[backend] listening on http://localhost:${PORT} (CORS origin: ${ALLOWED_ORIGINS.join(', ')})`)
})

