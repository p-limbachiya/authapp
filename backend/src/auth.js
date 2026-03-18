import jwt from 'jsonwebtoken'

const DEFAULT_EXPIRES_IN = '30m' // keeps same behavior as original demo

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET in environment')
  }
  return secret
}

function parseExpiresInToMs(expiresIn) {
  if (typeof expiresIn !== 'string' || !expiresIn.trim()) return null
  const raw = expiresIn.trim()
  const m = raw.match(/^(\d+)\s*(ms|s|m|h|d)$/i)
  if (!m) return null
  const n = Number(m[1])
  const unit = m[2].toLowerCase()
  if (!Number.isFinite(n) || n <= 0) return null
  const mult =
    unit === 'ms' ? 1 : unit === 's' ? 1000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000
  return n * mult
}

export function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN ?? DEFAULT_EXPIRES_IN
}

export function issueToken({ userId, role }) {
  const expiresIn = getJwtExpiresIn()
  const ttlMs = parseExpiresInToMs(expiresIn) ?? 30 * 60 * 1000
  const expiresAt = Date.now() + ttlMs

  // Keep expMs for frontend's local expiry checks, but also set JWT exp for server enforcement.
  const token = jwt.sign({ sub: userId, role, expMs: expiresAt }, getJwtSecret(), { expiresIn })
  return { token, expiresAt }
}

export function verifyToken(token) {
  const payload = jwt.verify(token, getJwtSecret())
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid token')
  }

  const expMs = payload.expMs
  if (typeof expMs === 'number' && Date.now() > expMs) {
    const err = new Error('Session expired')
    err.code = 'SESSION_EXPIRED'
    throw err
  }

  return payload
}

export function getBearerToken(req) {
  const header = req.headers.authorization
  if (!header) return null
  const [scheme, value] = header.split(' ')
  if (scheme !== 'Bearer' || !value) return null
  return value
}

export function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req)
    if (!token) return res.status(401).json({ error: 'Missing Authorization header' })
    const payload = verifyToken(token)
    req.auth = { userId: payload.sub, role: payload.role, expMs: payload.expMs }
    return next()
  } catch (e) {
    const code = e?.code === 'SESSION_EXPIRED' ? 'SESSION_EXPIRED' : 'INVALID_TOKEN'
    const message = code === 'SESSION_EXPIRED' ? 'Your session has expired. Please log in again.' : 'Invalid token.'
    return res.status(401).json({ error: message, code })
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.auth?.role
    if (!role) return res.status(401).json({ error: 'Not authenticated' })
    if (!allowedRoles.includes(role)) return res.status(403).json({ error: 'Not authorized' })
    return next()
  }
}

