'use client'

import { AppLayout } from '../../components/AppLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { DashboardPage as DashboardContent } from '../../screens/DashboardPage'

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'user']}>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </ProtectedRoute>
  )
}

