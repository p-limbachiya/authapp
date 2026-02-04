'use client'

import { AppLayout } from '../../src/components/AppLayout'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'
import { ReportsPage as ReportsContent } from '../../src/pages/ReportsPage'

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <AppLayout>
        <ReportsContent />
      </AppLayout>
    </ProtectedRoute>
  )
}

