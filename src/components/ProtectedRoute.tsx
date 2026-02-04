import type { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUserRole } from '../redux/auth/authSlice'
import type { UserRole } from '../api/fakeAuthApi'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectUserRole)
  const router = useRouter()
  const pathname = usePathname()

  if (!isAuthenticated) {
    const from = encodeURIComponent(pathname ?? '/dashboard')
    router.replace(`/login?from=${from}`)
    return null
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    router.replace('/not-authorized')
    return null
  }

  return <>{children}</>
}

