import { apiRequest, ApiError } from './http'

export type UserRole = 'admin' | 'manager' | 'user'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  user: AuthUser
  token: string
  expiresAt: number
}

export class AuthError extends Error {
  code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'SESSION_EXPIRED' | 'INVALID_TOKEN' | 'UNKNOWN'
  constructor(code: AuthError['code'], message: string) {
    super(message)
    this.code = code
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    return await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  } catch (e) {
    if (e instanceof ApiError) {
      const code =
        (e.code as AuthError['code']) ??
        (e.status === 401 ? 'INVALID_CREDENTIALS' : 'UNKNOWN')
      throw new AuthError(code, e.message)
    }
    throw new AuthError('UNKNOWN', 'Unexpected error. Please try again.')
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await apiRequest<{ valid: boolean }>('/auth/validate', {
      method: 'POST',
      token,
      body: JSON.stringify({}),
    })
    return res.valid
  } catch (e) {
    if (e instanceof ApiError) {
      const code = (e.code as AuthError['code']) ?? 'INVALID_TOKEN'
      throw new AuthError(code, e.message)
    }
    throw new AuthError('UNKNOWN', 'Failed to validate session.')
  }
}

