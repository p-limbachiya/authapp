'use client'

import { AppLayout } from '../../components/AppLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { AdminPage as AdminContent } from '../../screens/AdminPage'

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AppLayout>
        <AdminContent />
      </AppLayout>
    </ProtectedRoute>
  )
}

