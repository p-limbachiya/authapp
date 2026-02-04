import type { Middleware } from '@reduxjs/toolkit'
import { logout } from './authSlice'

const DEV = process.env.NODE_ENV !== 'production'

export const authMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action)

  const state = storeApi.getState() as { auth?: { isAuthenticated?: boolean; expiresAt?: number | null } }

  if (DEV && typeof action === 'object' && action && 'type' in action && typeof action.type === 'string') {
    if (state.auth) {
      // eslint-disable-next-line no-console
      console.log('[authMiddleware] action:', action.type, 'state:', state.auth)
    }
  }

  if (state.auth?.isAuthenticated && state.auth.expiresAt && Date.now() > state.auth.expiresAt) {
    storeApi.dispatch(logout())
  }

  return result
}

