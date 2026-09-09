import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { openOffersWhere } from '@/lib/jobs'
import JobCard from '@/components/JobCard'

// Section « Recrutement » de l'accueil : masquée s'il n'y a aucune offre ouverte.
export default async function Recruitment() {
  const offers = await prisma.jobOffer.findMany({
    where: openOffersWhere(),
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take: 3,
    select: { id: true, title: true, slug: true, department: true, location: true, type: true, image: true },
  })

  if (offers.length === 0) return null

  return (
    <section id="recrutement" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Rejoignez-nous</span>
          <h2 className="section-title mt-2">Nous recrutons</h2>
          <p className="section-subtitle">
            Participez à une médecine d&apos;excellence au Tchad. Découvrez nos postes ouverts et postulez en ligne.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {offers.map((o) => (
            <div key={o.id} className="w-full sm:w-[340px]">
              <JobCard job={o} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/recrutement"
            className="inline-flex items-center gap-2 border-2 border-[#1D6FA4] text-[#1D6FA4] px-6 py-3 rounded-lg font-semibold hover:bg-[#1D6FA4] hover:text-white transition-colors text-sm"
          >
            Voir toutes les offres
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
