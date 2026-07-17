import AdminShell from '@/components/admin/AdminShell'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Administration — Mayo Klinic',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = await prisma.appointment.count({ where: { status: 'PENDING' } })

  return <AdminShell pendingCount={pendingCount}>{children}</AdminShell>
}
