'use client'

import { useState } from 'react'

export type PublicFaq = {
  id: number
  question: string
  answer: string
}

export default function FAQ({ faqs }: { faqs: PublicFaq[] }) {
  const [open, setOpen] = useState<number | null>(0)

  if (faqs.length === 0) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div>
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">FAQ</span>
            <h2 className="section-title mt-2">Toutes vos réponses en un seul endroit</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Retrouvez les réponses aux questions les plus fréquentes sur notre clinique, notre équipe et nos services. Pour toute autre question, n&apos;hésitez pas à nous contacter.
            </p>
            <div className="bg-[#1D6FA4] text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-3">Vous avez d&apos;autres questions ?</h3>
              <p className="text-blue-100 mb-6 text-sm">Notre équipe est disponible pour répondre à toutes vos questions concernant nos services de santé.</p>
              <a href="#contact" className="bg-white text-[#1D6FA4] px-6 py-2 rounded font-semibold text-sm hover:bg-blue-50 transition-colors inline-block">
                Nous contacter
              </a>
            </div>
          </div>

          {/* Right column — accordion */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-gray-800 hover:text-[#1D6FA4] transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${open === i ? 'border-[#1D6FA4] bg-[#1D6FA4] text-white' : 'border-gray-300 text-gray-400'}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      {open === i
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />}
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
