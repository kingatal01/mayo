'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export type AdminUser = { name: string; email: string; role: string }

export default function AdminShell({
  pendingCount,
  newApplicationsCount,
  user,
  children,
}: {
  pendingCount: number
  newApplicationsCount: number
  user: AdminUser
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCount={pendingCount}
        newApplicationsCount={newApplicationsCount}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
