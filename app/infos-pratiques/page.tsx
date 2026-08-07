import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: 'Informations pratiques — Mayo Klinic',
  description:
    "Horaires d'ouverture de la Mayo Klinic et organisation de la prise en charge. Urgences ouvertes 24h/24 et 7j/7 à N'Djamena.",
}

const horaires = [
  { periode: 'Lundi à Vendredi', valeur: '08h30 – 16h30' },
  { periode: 'Samedi', valeur: '08h30 – 13h00' },
  { periode: 'Dimanche & jours fériés', valeur: 'Urgences uniquement' },
  { periode: 'Nuit', valeur: 'Urgences uniquement' },
]

export default function InfosPratiquesPage() {
  return (
    <SiteLayout>
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Informations pratiques
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">Horaires et organisation</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Retrouvez nos horaires d’ouverture et le déroulé de votre prise en charge à la Mayo Klinic.
          </p>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Horaires */}
          <div>
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Horaires d’ouverture</span>
            <h2 className="section-title mt-2 mb-6">Nos horaires</h2>
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d2d6b] text-white text-left">
                    <th className="px-6 py-3 font-semibold">Période</th>
                    <th className="px-6 py-3 font-semibold">Horaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {horaires.map((h) => (
                    <tr key={h.periode}>
                      <td className="px-6 py-3.5 text-gray-700 font-medium">{h.periode}</td>
                      <td className="px-6 py-3.5 text-gray-500">{h.valeur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-5">
              <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Urgences 24h/24 · 7j/7
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Les urgences sont ouvertes tous les jours de l’année. Les services de laboratoire, d’imagerie médicale et
                de chirurgie restent mobilisables à tout moment pour toute admission ou intervention d’urgence, y compris
                le dimanche, les jours fériés et la nuit.
              </p>
            </div>
          </div>

          {/* Organisation */}
          <div>
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Prise en charge</span>
            <h2 className="section-title mt-2 mb-6">Comment s’organise votre prise en charge</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Nos équipes accompagnent chaque patient hospitalisé tout au long de son séjour, avec pour objectif un retour
              rapide et sécurisé à l’autonomie — ou l’orientation vers la structure la plus adaptée, localement ou à
              l’international si nécessaire.
            </p>
            <div className="bg-[#0d2d6b] text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-3">Une question, un rendez-vous ?</h3>
              <p className="text-blue-100 text-sm mb-6">Notre équipe est à votre écoute pour vous orienter et organiser votre visite.</p>
              <a
                href="/#appointment"
                className="inline-block bg-white text-[#0d2d6b] px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                Prendre rendez-vous
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
