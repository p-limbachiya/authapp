import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Spinner, Center, useToast } from '@chakra-ui/react'
import { restoreSession, clearError, selectAuth } from '../redux/auth/authSlice'
import type { AppDispatch } from '../redux/store'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ReportsPage } from '../pages/ReportsPage'
import { AdminPage } from '../pages/AdminPage'
import { NotAuthorizedPage } from '../pages/NotAuthorizedPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AppLayout } from '../layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

export const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector(selectAuth)
  const toast = useToast()
  const location = useLocation()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Authentication error',
        description: error,
        status: 'error',
        isClosable: true,
        duration: 5000,
      })
      dispatch(clearError())
    }
  }, [error, dispatch, toast])

  if (loading && location.pathname === '/') {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Box minH="100vh">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'user']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  )
}

