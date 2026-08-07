import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: 'Urgences 24h/24 | Mayo Klinic',
  description:
    "Les urgences de la Mayo Klinic sont ouvertes 24h/24 et 7j/7. Prise en charge immédiate, ambulance médicalisée, bloc opératoire et soins intensifs à N'Djamena.",
}

const accueil = [
  {
    title: 'Vous vous présentez directement à la clinique',
    text: "Personnel d'entreprises partenaires, expatriés, familles abonnées ou tout patient se présentant spontanément sont accueillis et pris en charge sans délai.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    ),
  },
  {
    title: 'Vous êtes pris en charge sur le terrain',
    text: "Notre ambulance médicalisée, équipée d'un kit de premiers secours avancé, intervient sur site (accident, urgence scolaire ou industrielle) pour une stabilisation et un transport sécurisé. Une extraction par voie aérienne médicalisée est également possible.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    ),
  },
  {
    title: 'Votre médecin nous transfère votre dossier',
    text: 'En coordination avec les cliniques mobiles présentes sur les chantiers ou les structures scolaires partenaires, un transfert médical peut être organisé en amont de votre arrivée.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
]

const critiques = [
  'Une stabilisation immédiate avec bilans prioritaires (imagerie, biologie)',
  "Un accès direct au bloc opératoire si une intervention chirurgicale s'impose",
  'Une surveillance continue en unité de soins intensifs jusqu’à votre sortie ou orientation',
]

export default function UrgencesPage() {
  return (
    <SiteLayout>
      {/* En-tête */}
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Urgences 24h/24 · 7j/7
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Une prise en charge d’urgence rapide, à toute heure
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Les urgences de la Mayo Klinic sont ouvertes 24 heures sur 24, 7 jours sur 7. Dès votre arrivée, votre situation
            est évaluée immédiatement par notre équipe médicale afin de vous orienter vers la prise en charge adaptée.
          </p>
        </div>
      </header>

      {/* Comment nous vous accueillons */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Prise en charge</span>
            <h2 className="section-title mt-2">Comment nous vous accueillons</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accueil.map((a) => (
              <div key={a.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#1D6FA4]/10 text-[#1D6FA4] flex items-center justify-center mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {a.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 leading-snug">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgences vitales & soins critiques */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Soins critiques</span>
            <h2 className="section-title mt-2">Urgences vitales et soins critiques</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Pour les urgences les plus graves (traumatismes majeurs, infarctus, AVC, détresses respiratoires), notre
              équipe assure :
            </p>
            <ul className="space-y-4">
              {critiques.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-gray-700">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bon à savoir */}
          <div className="bg-[#0d2d6b] text-white rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <h3 className="text-xl font-bold">Bon à savoir</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Toute personne se présentant en détresse est accueillie, quel que soit son motif de consultation. Notre
              équipe vous oriente si nécessaire vers la structure la plus adaptée à votre situation, dans votre intérêt et
              celui des autres patients.
            </p>
          </div>
        </div>
      </section>

      {/* CTA urgence */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">En cas d’urgence médicale, appelez immédiatement</h2>
          <p className="text-red-100 mb-6">Notre équipe d’urgence est disponible à toute heure, tous les jours de l’année.</p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
          >
            Voir nos coordonnées
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </SiteLayout>
  )
}
