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

export default function Home() {
  return (
    <main>
      <TopBar />
      <Navbar />
      <Hero />
      <WhatWeProvide />
      <About />
      <Services />
      <Testimonials />
      <FAQ />
      <Team />
      <Newsletter />
      <Blog />
      <Appointment />
      <Footer />
    </main>
  )
}
