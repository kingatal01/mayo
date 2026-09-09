import JobOffersManager from '@/components/admin/JobOffersManager'
import { prisma } from '@/lib/prisma'

export default async function AdminRecrutement() {
  const offers = await prisma.jobOffer.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { _count: { select: { applications: true } } },
  })

  const rows = offers.map((o) => ({
    id: o.id,
    title: o.title,
    slug: o.slug,
    department: o.department,
    location: o.location,
    type: o.type,
    image: o.image,
    description: o.description,
    missions: o.missions,
    profile: o.profile,
    openingDate: o.openingDate,
    closingDate: o.closingDate,
    published: o.published,
    applicationsCount: o._count.applications,
  }))

  return <JobOffersManager offers={rows} />
}
