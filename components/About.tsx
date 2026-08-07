import Image from 'next/image'

export type AboutStat = { id: number; value: string; label: string }

export type AboutContent = {
  title: string
  paragraph1: string
  paragraph2: string
  image: string
  badge1Value: string
  badge1Label: string
  badge2Value: string
  badge2Label: string
}

export default function About({ content, stats }: { content: AboutContent; stats: AboutStat[] }) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative shadow-xl">
              <Image src={content.image} alt="Façade Mayo Klinic" fill className="object-cover object-center" />
              {/* subtle overlay */}
              <div className="absolute inset-0 bg-[#0d2d6b]/10" />
            </div>

            {/* Floating badge bas-droite */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-5 flex items-center gap-4 z-10">
              <div className="w-14 h-14 bg-[#0d2d6b] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{content.badge1Value}</div>
                <div className="text-gray-500 text-sm">{content.badge1Label}</div>
              </div>
            </div>

            {/* Floating badge haut-gauche */}
            <div className="absolute -top-6 -left-6 bg-[#0d2d6b] rounded-xl shadow-xl p-5 flex items-center gap-4 z-10">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-[#0d2d6b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold">{content.badge2Value}</div>
                <div className="text-blue-200 text-sm">{content.badge2Label}</div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div>
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">À Propos</span>
            <h2 className="section-title mt-2">{content.title}</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">{content.paragraph1}</p>
            {content.paragraph2 && <p className="text-gray-500 mb-8 leading-relaxed">{content.paragraph2}</p>}

            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#0d2d6b] rounded-full flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-800">{item.value} </span>
                      <span className="text-gray-500 text-sm">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <a href="#service" className="btn-primary inline-block">
                Nos spécialités
              </a>
              <a href="#appointment" className="btn-outline inline-block">
                Prendre RDV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
