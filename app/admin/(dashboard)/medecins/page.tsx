import DoctorsManager from '@/components/admin/DoctorsManager'
import { prisma } from '@/lib/prisma'

export default async function AdminDoctors() {
  const [doctors, specialties] = await Promise.all([
    prisma.doctor.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        specialty: true,
        initials: true,
        photo: true,
        color: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        active: true,
      },
    }),
    prisma.specialty.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { title: true },
    }),
  ])

  return <DoctorsManager doctors={doctors} specialtyOptions={specialties.map((s) => s.title)} />
}
