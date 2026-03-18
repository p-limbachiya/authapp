export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export class ApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  }
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  const res = await fetch(url, { ...options, headers })
  if (res.ok) return (await parseJsonSafe(res)) as T

  const body = await parseJsonSafe(res)
  throw new ApiError(body?.error ?? 'Request failed', res.status, body?.code)
}

