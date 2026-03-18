import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { login as apiLogin, validateToken, AuthResponse, UserRole, AuthError } from '../../api/authApi'
import type { RootState } from '../store'

export interface AuthState {
  user: AuthResponse['user'] | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  expiresAt: number | null
}

const STORAGE_KEY = 'auth_app_session'

const loadSession = (): Partial<AuthState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<AuthState>
  } catch {
    return null
  }
}

const saveSession = (state: AuthState) => {
  const { user, token, role, isAuthenticated, expiresAt } = state
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user,
      token,
      role,
      isAuthenticated,
      expiresAt,
    }),
  )
}

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  expiresAt: null,
}

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await apiLogin(credentials.email, credentials.password)
  } catch (error) {
    if (error instanceof AuthError) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Unexpected error. Please try again.')
  }
})

export const restoreSession = createAsyncThunk<
  AuthResponse | null,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  const stored = loadSession()
  if (!stored || !stored.token || !stored.expiresAt || !stored.user || !stored.role) {
    return null
  }

  try {
    const valid = await validateToken(stored.token)
    if (!valid) {
      clearSession()
      return null
    }

    return {
      user: stored.user,
      token: stored.token,
      expiresAt: stored.expiresAt,
    } as AuthResponse
  } catch (error) {
    if (error instanceof AuthError && error.code === 'SESSION_EXPIRED') {
      clearSession()
      return rejectWithValue(error.message)
    }
    clearSession()
    return rejectWithValue('Failed to restore session.')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.expiresAt = null
      clearSession()
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
        state.error = null
        state.expiresAt = action.payload.expiresAt
        saveSession(state)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Login failed.'
      })
      .addCase(restoreSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false
        if (!action.payload) {
          return
        }
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
        state.expiresAt = action.payload.expiresAt
        saveSession(state)
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.token = null
        state.role = null
        state.isAuthenticated = false
        state.expiresAt = null
        if (action.payload) {
          state.error = action.payload
        }
      })
  },
})

export const { logout, clearError } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUserRole = (state: RootState) => state.auth.role
export const selectAuthError = (state: RootState) => state.auth.error

