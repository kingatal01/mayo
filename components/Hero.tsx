'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export type HeroSlideData = {
  id: number
  tag: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: string
}

export type HeroStat = { id: number; value: string; label: string }

const bgGradients = [
  'from-[#0d2d6b]/80 to-[#1D6FA4]/80',
  'from-[#0a2450]/80 to-[#1a5f8e]/80',
  'from-[#0d2d6b]/80 to-[#1D6FA4]/80',
]

export default function Hero({ slides, stats }: { slides: HeroSlideData[]; stats: HeroStat[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  const slide = slides[Math.min(current, slides.length - 1)]
  const bg = bgGradients[current % bgGradients.length]

  return (
    <section id="home" className="relative min-h-[620px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-700">
        <Image src={slide.image} alt="Mayo Klinic" fill className="object-cover object-center" priority />
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${bg}`} />
      </div>

      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/5 border border-white/10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/5 border border-white/10" />
      </div>

      {/* Cross medical icon */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-5 hidden lg:block pointer-events-none">
        <svg className="w-80 h-80 text-white" fill="currentColor" viewBox="0 0 100 100">
          <rect x="40" y="10" width="20" height="80" rx="4" />
          <rect x="10" y="40" width="80" height="20" rx="4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 w-full">
        <div className="max-w-2xl">
          {slide.tag && (
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-4 backdrop-blur-sm border border-white/20">
              {slide.tag}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-lg drop-shadow">{slide.description}</p>
          <div className="flex flex-wrap gap-4">
            <a href={slide.ctaHref} className="bg-white text-[#0d2d6b] px-8 py-3 rounded font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg">
              {slide.ctaLabel}
            </a>
            <a href="#service" className="border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white hover:text-[#0d2d6b] transition-colors duration-200">
              Nos Spécialités
            </a>
          </div>
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="flex gap-2 mt-14">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats bar */}
      {stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0d2d6b]/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
