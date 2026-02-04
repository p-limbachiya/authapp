'use client'

import { AppLayout } from '../../src/components/AppLayout'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'
import { DashboardPage as DashboardContent } from '../../src/pages/DashboardPage'

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'user']}>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </ProtectedRoute>
  )
}

