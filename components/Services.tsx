import { prisma } from '@/lib/prisma'
import { getSpecialtyIcon } from '@/components/specialty-assets'

export default async function Services() {
  const services = await prisma.specialty.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })

  return (
    <section id="service" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Ce que nous proposons</span>
          <h2 className="section-title mt-2">Nos Spécialités Médicales</h2>
          <p className="section-subtitle">
            Un large éventail de spécialités médicales pour répondre à tous vos besoins de santé avec expertise et bienveillance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 [&_svg]:w-10 [&_svg]:h-10 ${s.color}`}>
                {s.icon ? (
                  <span dangerouslySetInnerHTML={{ __html: s.icon }} />
                ) : (
                  getSpecialtyIcon(s.title)
                )}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2 leading-snug">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{s.description}</p>
              <a href="#appointment" className="text-[#1D6FA4] font-semibold text-sm hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">
                Prendre RDV
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
