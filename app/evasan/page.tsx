import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: 'Évacuation sanitaire internationale (EVASAN) | Mayo Klinic',
  description:
    "La Mayo Klinic organise une évacuation sanitaire internationale complète et sécurisée : dédouanement médical, coordination avec votre assurance, surveillance et transfert vers nos hôpitaux pivots.",
}

const etapes = [
  {
    n: 1,
    title: 'Dédouanement médical',
    text: 'Notre médecin-chef évalue le dossier, certifie l’aptitude au vol du patient et prépare le rapport médical de transfert.',
  },
  {
    n: 2,
    title: 'Coordination administrative',
    text: 'Notre secrétariat dédié contacte votre assurance ou compagnie d’assistance internationale pour valider la prise en charge financière et réserver un lit dans l’hôpital de destination.',
  },
  {
    n: 3,
    title: 'Surveillance jusqu’au départ',
    text: 'Le patient est installé en unité de surveillance continue jusqu’à l’arrivée du vecteur aérien.',
  },
  {
    n: 4,
    title: 'Transfert vers l’aéroport et destination',
    text: 'Transfert en ambulance médicalisée vers l’Aéroport International de N’Djamena (15 minutes de la clinique), puis évacuation vers notre réseau d’hôpitaux pivots.',
  },
]

const hopitaux = ['Tunis', 'Casablanca', 'Johannesburg', 'Nairobi', 'Europe', 'Turquie']

export default function EvasanPage() {
  return (
    <SiteLayout>
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            EVASAN · Évacuation sanitaire internationale
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Quand vos soins nécessitent une prise en charge à l’international
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Lorsque l’état d’un patient nécessite une expertise médicale hautement spécialisée, ou à la demande de
            l’institution garante (assurance, employeur, représentation diplomatique), la Mayo Klinic organise une
            évacuation sanitaire internationale complète et sécurisée.
          </p>
        </div>
      </header>

      {/* Processus */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Notre processus</span>
            <h2 className="section-title mt-2">Étape par étape</h2>
          </div>
          <div className="space-y-8">
            {etapes.map((e, i) => (
              <div key={e.n} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#1D6FA4] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {e.n}
                  </div>
                  {i < etapes.length - 1 && <div className="w-px flex-1 bg-gray-200 my-2" />}
                </div>
                <div className="pb-2">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{e.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hôpitaux pivots */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Destinations</span>
          <h2 className="section-title mt-2 mb-8">Notre réseau d’hôpitaux pivots</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {hopitaux.map((h) => (
              <span key={h} className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Réassurance */}
      <section className="py-16 bg-[#0d2d6b]">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Une prise en charge sereine</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Notre équipe s’occupe de l’ensemble des démarches médicales et administratives afin que vous, ou vos proches,
            puissiez vous concentrer sur l’essentiel : la santé.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-white text-[#0d2d6b] px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Nous contacter
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </SiteLayout>
  )
}
