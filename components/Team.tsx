import { prisma } from '@/lib/prisma'
import { doctorSocialIcons } from '@/components/doctor-assets'

export default async function Team() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })

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
          {doctors.map((doc) => {
            return (
              <div key={doc.id} className="group text-center">
                <div className="relative overflow-hidden rounded-xl mb-5">
                  {doc.photo ? (
                    <div className="aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-br ${doc.color} aspect-square flex items-center justify-center`}>
                      <div className="text-white">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-4xl font-bold">
                          {doc.initials}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Overlay au survol : identique pour tous, avec les liens sociaux */}
                  <div className="absolute inset-0 bg-[#1D6FA4]/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {doctorSocialIcons.map((s) => {
                      const url = doc[s.key]
                      return (
                        <a
                          key={s.key}
                          href={url ?? '#'}
                          target={url ? '_blank' : undefined}
                          rel={url ? 'noopener noreferrer' : undefined}
                          aria-label={s.label}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1D6FA4] hover:bg-[#1D6FA4] hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                          </svg>
                        </a>
                      )
                    })}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                <p className="text-[#1D6FA4] text-sm font-medium mt-1">{doc.specialty}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
