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
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21" />
    ),
  },
  {
    title: 'Imagerie médicale',
    text: 'Radiographie numérique, scanner, mammographie, échographie diagnostique, électrocardiogramme.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    ),
  },
  {
    title: 'Biologie médicale & pathologie',
    text: 'Analyses biochimiques, hématologie complète, analyses anatomopathologiques.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.7-1.31 2.7H4.11c-1.34 0-2.31-1.7-1.31-2.7L4.2 15.3" />
    ),
  },
  {
    title: 'Spécialités chirurgicales',
    text: 'Chirurgie orthopédique et traumatologique, chirurgie générale d’urgence et viscérale, gynécologie-obstétrique, neurochirurgie et chirurgie vasculaire, chirurgie maxillo-faciale et esthétique.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437" />
    ),
  },
  {
    title: 'Consultations externes & médecine spécialisée',
    text: 'Cardiologie, ophtalmologie, rhumatologie, diabétologie, oncologie, gastro-entérologie, nutrition, urologie, hématologie, neurologie ; rééducation (MPR, physiothérapie) ; soins dentaires ; médecine de voyage.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    ),
  },
  {
    title: 'Unités de soins hospitaliers',
    text: 'Hospitalisation de courte durée post-opératoire et en soins continus, unité de cardiologie interventionnelle.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    ),
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filieres.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-xl p-6 flex gap-5 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#1D6FA4]/10 text-[#1D6FA4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {f.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 leading-snug">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.text}</p>
                </div>
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
