import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: 'Entreprises & Institutions | Mayo Klinic',
  description:
    "Solutions santé sur-mesure pour entreprises, organisations internationales, ambassades et écoles au Tchad : médecine du travail, abonnements corporate, cliniques mobiles, CaseVac/MedEvac.",
}

const offres = [
  {
    title: 'Médecine du travail',
    text: 'Pour vos collaborateurs : bilans d’aptitude et check-ups annuels, vaccinations internationales, délivrance et renouvellement des certificats d’aptitude médicale au travail.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    ),
  },
  {
    title: 'Formules d’abonnement corporate',
    text: 'Un accès simplifié aux soins pour vos équipes, avec une prise en charge administrative fluide (garantie de paiement, tiers-payant) qui élimine les démarches complexes en cas d’urgence : salariés en poste, en mission courte, ou leurs familles.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    ),
  },
  {
    title: 'Cliniques mobiles & interventions sur site',
    text: 'Pour les chantiers isolés ou les sites industriels, nos équipes médicales mobiles assurent une présence de proximité et coordonnent, en cas de besoin, un transfert vers la Mayo Klinic.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    ),
  },
  {
    title: 'Extraction & évacuation médicale (CaseVac / MedEvac)',
    text: 'En cas d’accident ou d’urgence sur site, notre ambulance médicalisée intervient pour une stabilisation immédiate et un transport sécurisé. Si l’état du patient l’exige, une évacuation sanitaire internationale est organisée vers nos hôpitaux pivots partenaires.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    ),
  },
  {
    title: 'Médecine scolaire',
    text: 'Suivi vaccinal, rappels et mise à jour des carnets de santé, ainsi que solutions d’évacuation médicalisée pour les établissements scolaires partenaires.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    ),
  },
]

const hopitaux = ['Tunis', 'Casablanca', 'Johannesburg', 'Nairobi', 'Europe', 'Turquie']

export default function EntreprisesPage() {
  return (
    <SiteLayout>
      <header className="bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Entreprises · Organisations · Écoles
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Des solutions santé sur-mesure pour vos équipes
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Entreprise, organisation internationale, ambassade ou établissement scolaire : la Mayo Klinic accompagne les
            institutions présentes au Tchad avec des solutions médicales adaptées à leurs contraintes opérationnelles.
          </p>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offres.map((o) => (
              <div key={o.title} className="bg-gray-50 rounded-xl p-6 flex gap-5 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#1D6FA4]/10 text-[#1D6FA4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {o.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 leading-snug">{o.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{o.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hôpitaux pivots */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Réseau international</span>
          <h2 className="section-title mt-2 mb-8">Nos hôpitaux pivots partenaires</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {hopitaux.map((h) => (
              <span key={h} className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d2d6b]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Construisons une offre adaptée à votre organisation</h2>
          <p className="text-blue-100 mb-6">Notre équipe vous accompagne dans la mise en place d’une solution corporate ou institutionnelle.</p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-white text-[#0d2d6b] px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Contactez notre équipe
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </SiteLayout>
  )
}
