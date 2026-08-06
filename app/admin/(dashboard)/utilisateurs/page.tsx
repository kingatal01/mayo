import { redirect } from 'next/navigation'
import UsersManager from '@/components/admin/UsersManager'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export default async function AdminUsers() {
  const me = await getCurrentUser()
  if (!me) redirect('/admin/login')
  if (me.role !== 'ADMIN') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Accès restreint</h1>
        <p className="text-sm text-gray-500">La gestion des utilisateurs est réservée aux administrateurs.</p>
      </div>
    )
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  return <UsersManager users={users} currentUserId={me.id} />
}
