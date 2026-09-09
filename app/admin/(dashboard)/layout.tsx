import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export const metadata = {
  title: 'Administration | Mayo Klinic',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const [pendingCount, newApplicationsCount] = await Promise.all([
    prisma.appointment.count({ where: { status: 'PENDING' } }),
    prisma.jobApplication.count({ where: { status: 'NEW' } }),
  ])

  return (
    <AdminShell pendingCount={pendingCount} newApplicationsCount={newApplicationsCount} user={user}>
      {children}
    </AdminShell>
  )
}
