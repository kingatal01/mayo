import HeroSlidesSection from '@/components/admin/HeroSlidesSection'
import StatsSection from '@/components/admin/StatsSection'
import AboutSection, { type AboutSettings } from '@/components/admin/AboutSection'
import { prisma } from '@/lib/prisma'

const aboutDefaults: AboutSettings = {
  about_title: 'Bienvenue à Mayo Klinic',
  about_paragraph1: '',
  about_paragraph2: '',
  about_image: '/image_face.jpeg',
  about_badge1_value: '15+',
  about_badge1_label: "Années d'excellence",
  about_badge2_value: '500+',
  about_badge2_label: 'Patients satisfaits',
}

export default async function AdminContent() {
  const [slides, stats, aboutRows] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
    prisma.stat.findMany({ orderBy: { order: 'asc' } }),
    prisma.setting.findMany({ where: { key: { startsWith: 'about_' } } }),
  ])

  const aboutValues = Object.fromEntries(aboutRows.map((r) => [r.key, r.value]))
  const aboutSettings: AboutSettings = { ...aboutDefaults, ...aboutValues }

  const heroStats = stats.filter((s) => s.section === 'HERO').map((s) => ({ id: s.id, value: s.value, label: s.label }))
  const aboutStats = stats.filter((s) => s.section === 'ABOUT').map((s) => ({ id: s.id, value: s.value, label: s.label }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contenu du site</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez le bandeau principal (Hero), les statistiques et la section « À propos ».
        </p>
      </div>

      <div className="space-y-6">
        <HeroSlidesSection slides={slides} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StatsSection title="Statistiques du Hero (barre du bas)" section="HERO" stats={heroStats} />
          <StatsSection title="Statistiques « À propos »" section="ABOUT" stats={aboutStats} />
        </div>

        <AboutSection settings={aboutSettings} />
      </div>
    </div>
  )
}
