import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, socialLinks } from '@/lib/settings'

// En-tête + pied de page communs aux pages secondaires (Urgences, Entreprises…).
// Récupère les paramètres du site et l'équipe pour alimenter TopBar/Footer.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    prisma.specialty.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      take: 8,
      select: { title: true },
    }),
  ])
  const socials = socialLinks(settings)

  return (
    <main>
      <TopBar phone={settings.phone} email={settings.email} address={settings.address} socials={socials} />
      <Navbar />
      {children}
      <Footer settings={settings} services={services.map((s) => s.title)} socials={socials} />
    </main>
  )
}
