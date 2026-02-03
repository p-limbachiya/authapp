export type UserRole = 'admin' | 'manager' | 'user'

export interface FakeUser {
  id: string
  name: string
  email: string
  role: UserRole
  password: string
}

export interface AuthResponse {
  user: Omit<FakeUser, 'password'>
  token: string
  expiresAt: number
}

const FAKE_USERS: FakeUser[] = [
  {
    id: '1',
    name: 'Alice Admin',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password',
  },
  {
    id: '2',
    name: 'Mark Manager',
    email: 'manager@example.com',
    role: 'manager',
    password: 'password',
  },
  {
    id: '3',
    name: 'Ulysses User',
    email: 'user@example.com',
    role: 'user',
    password: 'password',
  },
]

const MIN_DELAY = 800
const MAX_DELAY = 1500

const randomDelay = () =>
  new Promise<void>((resolve) => {
    const ms = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY)
    setTimeout(() => resolve(), ms)
  })

export class AuthError extends Error {
  code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'SESSION_EXPIRED'
  constructor(code: AuthError['code'], message: string) {
    super(message)
    this.code = code
  }
}

export async function fakeLogin(email: string, password: string): Promise<AuthResponse> {
  await randomDelay()

  const user = FAKE_USERS.find((u) => u.email === email)
  if (!user) {
    throw new AuthError('USER_NOT_FOUND', 'User not found. Please check your email.')
  }
  if (user.password !== password) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials. Please try again.')
  }

  const token = `fake-token-${user.id}-${Date.now()}`
  // session valid for 30 minutes
  const expiresAt = Date.now() + 30 * 60 * 1000

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
    expiresAt,
  }
}

export async function validateToken(token: string, expiresAt: number): Promise<boolean> {
  await randomDelay()

  if (!token) return false
  if (Date.now() > expiresAt) {
    throw new AuthError('SESSION_EXPIRED', 'Your session has expired. Please log in again.')
  }

  return true
}

