'use client'

import { AppLayout } from '../../components/AppLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { ReportsPage as ReportsContent } from '../../screens/ReportsPage'

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <AppLayout>
        <ReportsContent />
      </AppLayout>
    </ProtectedRoute>
  )
}

