import ApplicationsManager from '@/components/admin/ApplicationsManager'
import { prisma } from '@/lib/prisma'

export default async function AdminCandidatures() {
  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' },
    include: { offer: { select: { title: true } } },
  })

  const rows = applications.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    message: a.message,
    hasCv: Boolean(a.cvPath),
    status: a.status,
    createdAt: a.createdAt,
    offerTitle: a.offer.title,
  }))

  return <ApplicationsManager applications={rows} />
}
