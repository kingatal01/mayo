import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import JobCard from '@/components/JobCard'
import { prisma } from '@/lib/prisma'
import { listedOffersWhere, isOfferOpen } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Recrutement | Mayo Klinic',
  description:
    "Rejoignez la Mayo Klinic à N'Djamena. Découvrez nos offres d'emploi et postulez en ligne : médecins, infirmiers, personnel administratif et technique.",
}

export default async function RecrutementPage() {
  const offers = await prisma.jobOffer.findMany({
    where: listedOffersWhere(),
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      department: true,
      location: true,
      type: true,
      image: true,
      published: true,
      openingDate: true,
      closingDate: true,
    },
  })

  // Les offres ouvertes d'abord, les closes ensuite.
  const sorted = [...offers].sort((a, b) => Number(isOfferOpen(b)) - Number(isOfferOpen(a)))

  return (
    <SiteLayout>
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Rejoignez-nous
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">Offres d&apos;emploi</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Vous souhaitez contribuer à une médecine d&apos;excellence au Tchad ? Découvrez nos postes ouverts et
            postulez en ligne.
          </p>
        </div>
      </header>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {offers.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              Aucune offre ouverte pour le moment. Revenez bientôt.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {sorted.map((o) => (
                <div key={o.id} className="w-full sm:w-[340px]">
                  <JobCard job={o} closed={!isOfferOpen(o)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  )
}
