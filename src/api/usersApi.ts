import { apiRequest, ApiError } from './http'
import type { AuthUser, UserRole } from './authApi'

export interface UserCreateInput {
  name: string
  email: string
  role: UserRole
  password: string
}

export interface UserUpdateInput {
  name: string
  email: string
  role: UserRole
  password?: string
}

export async function listUsers(token: string): Promise<AuthUser[]> {
  const res = await apiRequest<{ users: AuthUser[] }>('/admin/users', { method: 'GET', token })
  return res.users
}

export async function createUser(token: string, input: UserCreateInput): Promise<AuthUser> {
  try {
    const res = await apiRequest<{ user: AuthUser }>('/admin/users', {
      method: 'POST',
      token,
      body: JSON.stringify(input),
    })
    return res.user
  } catch (e) {
    if (e instanceof ApiError) throw e
    throw e
  }
}

export async function updateUser(token: string, id: string, input: UserUpdateInput): Promise<AuthUser> {
  const res = await apiRequest<{ user: AuthUser }>(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(input),
  })
  return res.user
}

export async function deleteUser(token: string, id: string): Promise<void> {
  await apiRequest<unknown>(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    token,
  })
}

