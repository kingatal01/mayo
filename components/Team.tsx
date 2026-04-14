const doctors = [
  { name: 'Dr. Hamir Jun', specialty: 'Gastro-Entérologie', initials: 'HJ', color: 'from-blue-400 to-blue-600' },
  { name: 'Dr. Gideu Ds', specialty: 'Neurologie', initials: 'GD', color: 'from-purple-400 to-purple-600' },
  { name: 'Dr. Huduei Chy', specialty: 'Orthopédie', initials: 'HC', color: 'from-teal-400 to-teal-600' },
  { name: 'Dr. Marke Ah', specialty: 'Gynécologie & Obstétrique', initials: 'MA', color: 'from-pink-400 to-pink-600' },
  { name: 'Dr. David Sh', specialty: 'Cardiologie', initials: 'DS', color: 'from-green-400 to-green-600' },
  { name: 'Dr. Fajr Sadiq', specialty: 'Ophtalmologie', initials: 'FS', color: 'from-orange-400 to-orange-600' },
]

const socialLinks = [
  { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
]

export default function Team() {
  return (
    <section id="doctor" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Notre Équipe</span>
          <h2 className="section-title mt-2">Rencontrez nos Médecins</h2>
          <p className="section-subtitle">
            Notre équipe de professionnels médicaux expérimentés et dévoués est là pour vous offrir les meilleurs soins possibles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc, i) => (
            <div key={i} className="group text-center">
              <div className="relative overflow-hidden rounded-xl mb-5">
                <div className={`bg-gradient-to-br ${doc.color} aspect-square flex items-center justify-center`}>
                  <div className="text-white">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-4xl font-bold">
                      {doc.initials}
                    </div>
                  </div>
                </div>
                {/* Overlay with social links */}
                <div className="absolute inset-0 bg-[#1D6FA4]/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1D6FA4] hover:bg-[#1D6FA4] hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
              <p className="text-[#1D6FA4] text-sm font-medium mt-1">{doc.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
