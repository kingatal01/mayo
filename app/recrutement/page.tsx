import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { prisma } from '@/lib/prisma'
import { jobTypeLabels } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Recrutement | Mayo Klinic',
  description:
    "Rejoignez la Mayo Klinic à N'Djamena. Découvrez nos offres d'emploi et postulez en ligne : médecins, infirmiers, personnel administratif et technique.",
}

export default async function RecrutementPage() {
  const offers = await prisma.jobOffer.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

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

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {offers.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              Aucune offre ouverte pour le moment. Revenez bientôt.
            </div>
          ) : (
            <div className="space-y-5">
              {offers.map((o) => (
                <Link
                  key={o.id}
                  href={`/recrutement/${o.slug}`}
                  className="block bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-[#1D6FA4] group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-[#1D6FA4]/10 text-[#1D6FA4] px-3 py-1 rounded-full text-xs font-semibold">
                          {jobTypeLabels[o.type]}
                        </span>
                        <span className="text-xs text-gray-400">{o.department}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#1D6FA4] transition-colors">
                        {o.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {o.location}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#1D6FA4] font-semibold text-sm whitespace-nowrap">
                      Voir l&apos;offre
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  )
}
