import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteLayout from '@/components/SiteLayout'
import JobApplicationForm from '@/components/JobApplicationForm'
import { prisma } from '@/lib/prisma'
import { jobTypeLabels, isOfferOpen } from '@/lib/jobs'

function formatDate(d: Date | null) {
  if (!d) return null
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(d),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const offer = await prisma.jobOffer.findUnique({ where: { slug } })
  if (!offer) return { title: 'Offre introuvable | Mayo Klinic' }
  return { title: `${offer.title} | Recrutement Mayo Klinic`, description: offer.description.slice(0, 160) }
}

export default async function JobOfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const offer = await prisma.jobOffer.findUnique({ where: { slug } })
  if (!offer || !offer.published) notFound()

  const open = isOfferOpen(offer)
  const closing = formatDate(offer.closingDate)

  return (
    <SiteLayout>
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-16">
        <div className="max-w-4xl mx-auto px-4 text-white">
          <Link href="/recrutement" className="text-blue-200 hover:text-white text-sm inline-flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Toutes les offres
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{jobTypeLabels[offer.type]}</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{offer.department}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{offer.title}</h1>
          <div className="flex flex-wrap gap-4 text-blue-100 text-sm mt-3">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {offer.location}
            </span>
            {closing && <span>Candidatures jusqu&apos;au {closing}</span>}
          </div>
        </div>
      </header>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Description */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Le poste</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">{offer.description}</div>

            {offer.missions && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Missions</h2>
                <ul className="space-y-2.5 mb-8">
                  {offer.missions
                    .split('\n')
                    .map((m) => m.trim())
                    .filter(Boolean)
                    .map((m, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <span className="w-5 h-5 rounded-full bg-[#1D6FA4]/10 text-[#1D6FA4] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                </ul>
              </>
            )}

            {offer.profile && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Profil recherché</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">{offer.profile}</div>
              </>
            )}
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-6 lg:sticky lg:top-24">
              {open ? (
                <JobApplicationForm offerId={offer.id} />
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Candidatures closes</h3>
                  <p className="text-sm text-gray-500">Les candidatures pour cette offre ne sont plus ouvertes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
