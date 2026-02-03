import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth/authSlice'
import { authMiddleware } from './auth/authMiddleware'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
