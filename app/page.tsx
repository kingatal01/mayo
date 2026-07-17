import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WhatWeProvide from '@/components/WhatWeProvide'
import About from '@/components/About'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Team from '@/components/Team'
import Newsletter from '@/components/Newsletter'
import Blog from '@/components/Blog'
import Appointment from '@/components/Appointment'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, socialLinks } from '@/lib/settings'

export default async function Home() {
  const [specialties, testimonials, faqs, heroSlides, statRows, aboutSettings, siteSettings] = await Promise.all([
    prisma.specialty.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { title: true },
    }),
    prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, role: true, text: true, initials: true, color: true, rating: true },
    }),
    prisma.faq.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, question: true, answer: true },
    }),
    prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, tag: true, title: true, description: true, ctaLabel: true, ctaHref: true, image: true },
    }),
    prisma.stat.findMany({ orderBy: { order: 'asc' } }),
    prisma.setting.findMany({ where: { key: { startsWith: 'about_' } } }),
    getSiteSettings(),
  ])

  const socials = socialLinks(siteSettings)

  const s = Object.fromEntries(aboutSettings.map((x) => [x.key, x.value]))
  const aboutContent = {
    title: s.about_title ?? 'Bienvenue à Mayo Klinic',
    paragraph1: s.about_paragraph1 ?? '',
    paragraph2: s.about_paragraph2 ?? '',
    image: s.about_image || '/image_face.jpeg',
    badge1Value: s.about_badge1_value ?? '',
    badge1Label: s.about_badge1_label ?? '',
    badge2Value: s.about_badge2_value ?? '',
    badge2Label: s.about_badge2_label ?? '',
  }
  const heroStats = statRows.filter((x) => x.section === 'HERO').map((x) => ({ id: x.id, value: x.value, label: x.label }))
  const aboutStats = statRows.filter((x) => x.section === 'ABOUT').map((x) => ({ id: x.id, value: x.value, label: x.label }))

  return (
    <main>
      <TopBar phone={siteSettings.phone} email={siteSettings.email} address={siteSettings.address} socials={socials} />
      <Navbar />
      <Hero slides={heroSlides} stats={heroStats} />
      <WhatWeProvide />
      <About content={aboutContent} stats={aboutStats} />
      <Services />
      <Testimonials testimonials={testimonials} />
      <FAQ faqs={faqs} />
      <Team />
      <Newsletter phone={siteSettings.phone} />
      <Blog />
      <Appointment
        specialties={specialties.map((s) => s.title)}
        settings={{
          phone: siteSettings.phone,
          email: siteSettings.email,
          address: siteSettings.address,
          hours: siteSettings.hours,
          latitude: siteSettings.latitude,
          longitude: siteSettings.longitude,
        }}
      />
      <Footer settings={siteSettings} services={specialties.slice(0, 8).map((s) => s.title)} socials={socials} />
    </main>
  )
}
