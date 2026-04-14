'use client'

import { useState } from 'react'

const testimonials = [
  {
    name: 'Aïcha Mahamat',
    role: 'Directrice d\'entreprise',
    text: 'L\'équipe médicale est absolument remarquable. Ils m\'ont traitée avec un soin et un professionnalisme exceptionnels. Je suis profondément reconnaissante pour le service attentionné reçu tout au long de ma convalescence.',
    initials: 'AM',
    color: 'bg-blue-500',
  },
  {
    name: 'Ibrahim Oumar',
    role: 'Ingénieur',
    text: 'Je suis patient ici depuis plusieurs années et je peux affirmer en toute confiance que c\'est le meilleur établissement médical que j\'aie jamais fréquenté. Les médecins sont compétents et le personnel toujours serviable.',
    initials: 'IO',
    color: 'bg-purple-500',
  },
  {
    name: 'Fatima Hassan',
    role: 'Enseignante',
    text: 'Une expérience de soins exceptionnelle du début à la fin. La prise de rendez-vous était simple, l\'attente minimale, et le médecin attentif et bienveillant. Je recommande vivement cette clinique à tous.',
    initials: 'FH',
    color: 'bg-green-500',
  },
  {
    name: 'Moussa Ali',
    role: 'Chef d\'entreprise',
    text: 'Cette clinique a complètement changé ma vision des soins de santé. Le niveau d\'attention et les soins personnalisés que j\'ai reçus m\'ont fait me sentir véritablement pris en charge. Un personnel exemplaire.',
    initials: 'MA',
    color: 'bg-pink-500',
  },
  {
    name: 'Mariam Adoum',
    role: 'Pharmacienne',
    text: 'Dès mon arrivée, je me suis sentie accueillie et bien prise en charge. Les médecins ont pris le temps de tout expliquer clairement et ont répondu à toutes mes préoccupations. Un établissement vraiment centré sur le patient.',
    initials: 'MA',
    color: 'bg-yellow-500',
  },
  {
    name: 'Saleh Brahim',
    role: 'Fonctionnaire',
    text: 'Service et soins remarquables ! Les professionnels de santé vont au-delà des attentes pour leurs patients. Je suis très reconnaissant pour la qualité du traitement reçu. Le meilleur établissement de la région.',
    initials: 'SB',
    color: 'bg-red-500',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const perPage = 3
  const pages = Math.ceil(testimonials.length / perPage)
  const visible = testimonials.slice(current * perPage, current * perPage + perPage)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Témoignages</span>
          <h2 className="section-title mt-2">Ce que disent nos patients</h2>
          <p className="section-subtitle">
            Des témoignages authentiques de patients ayant bénéficié de nos services de santé de qualité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {visible.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-8 relative">
              {/* Quote icon */}
              <div className="text-[#1D6FA4] mb-4">
                <svg className="w-8 h-8 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#1D6FA4]' : 'w-2 bg-gray-300'}`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
