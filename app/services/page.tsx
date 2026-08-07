import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Nos Services | Mayo Klinic',
  description:
    "De la médecine d'urgence aux spécialités les plus pointues, la Mayo Klinic réunit une large gamme de services médicaux et chirurgicaux sous un même toit.",
}

const filieres = [
  {
    title: 'Urgences & médecine critique',
    text: 'Médecine d’urgence, consultations générales adultes et enfants, extraction médicalisée sur site (CaseVac), évacuation médicalisée nationale ou internationale (MedEvac).',
  },
  {
    title: 'Imagerie médicale',
    text: 'Radiographie numérique, scanner, mammographie, échographie diagnostique, électrocardiogramme.',
  },
  {
    title: 'Biologie médicale & pathologie',
    text: 'Analyses biochimiques, hématologie complète, analyses anatomopathologiques.',
  },
  {
    title: 'Spécialités chirurgicales',
    text: 'Chirurgie orthopédique et traumatologique, chirurgie générale d’urgence et viscérale, gynécologie-obstétrique, neurochirurgie et chirurgie vasculaire, chirurgie maxillo-faciale et esthétique.',
  },
  {
    title: 'Consultations externes & médecine spécialisée',
    text: 'Cardiologie, ophtalmologie, rhumatologie, diabétologie, oncologie, gastro-entérologie, nutrition, urologie, hématologie, neurologie ; rééducation (MPR, physiothérapie) ; soins dentaires ; médecine de voyage.',
  },
  {
    title: 'Unités de soins hospitaliers',
    text: 'Hospitalisation de courte durée post-opératoire et en soins continus, unité de cardiologie interventionnelle.',
  },
]

export default async function ServicesPage() {
  const specialties = await prisma.specialty.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: { id: true, title: true },
  })

  return (
    <SiteLayout>
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Une offre de soins complète
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Une offre de soins complète, sous un même toit
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            De la médecine d’urgence aux spécialités les plus pointues, la Mayo Klinic réunit une large gamme de services
            médicaux et chirurgicaux pour répondre à l’ensemble de vos besoins de santé.
          </p>
        </div>
      </header>

      {/* Filières */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filieres.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-xl p-6 border-t-4 border-[#1D6FA4] hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-gray-800 mb-2 leading-snug">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toutes les spécialités (depuis la BD) */}
      {specialties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Nos spécialités</span>
            <h2 className="section-title mt-2 mb-8">Toutes nos spécialités médicales</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {specialties.map((s) => (
                <span key={s.id} className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#0d2d6b]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Besoin d’une consultation ?</h2>
          <p className="text-blue-100 mb-6">Prenez rendez-vous avec l’un de nos spécialistes en quelques clics.</p>
          <a
            href="/#appointment"
            className="inline-flex items-center gap-2 bg-white text-[#0d2d6b] px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Prendre rendez-vous
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </SiteLayout>
  )
}
