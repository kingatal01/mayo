import SpecialtiesManager from '@/components/admin/SpecialtiesManager'
import { prisma } from '@/lib/prisma'

export default async function AdminSpecialties() {
  const specialties = await prisma.specialty.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, title: true, description: true, icon: true, color: true, active: true },
  })

  return <SpecialtiesManager specialties={specialties} />
}
