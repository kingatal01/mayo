import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import JobCard from '@/components/JobCard'
import JobApplicationForm from '@/components/JobApplicationForm'
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
              Aucune offre ouverte pour le moment. Vous pouvez nous adresser une candidature spontanée ci-dessous.
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

      {/* Candidature spontanée : toujours visible, même sans offre ouverte. */}
      <section id="candidature-spontanee" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">
                Candidature spontanée
              </span>
              <h2 className="section-title mt-2">Aucune offre ne correspond à votre profil ?</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Envoyez-nous votre candidature même si aucun poste ouvert ne correspond à votre parcours. Notre équipe
                RH conserve votre dossier et vous recontacte dès qu&apos;une opportunité se présente.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                {[
                  'Médecins, infirmiers et personnel soignant',
                  'Plateau technique : imagerie, laboratoire, pharmacie',
                  'Fonctions support : administration, logistique, technique',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#1D6FA4] flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <JobApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
