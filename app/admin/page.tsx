'use client'

import { AppLayout } from '../../src/components/AppLayout'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'
import { AdminPage as AdminContent } from '../../src/pages/AdminPage'

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AppLayout>
        <AdminContent />
      </AppLayout>
    </ProtectedRoute>
  )
}

