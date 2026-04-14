'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'Comment prendre rendez-vous dans votre clinique ?',
    answer: 'Vous pouvez prendre rendez-vous directement en ligne via le formulaire de notre site, par téléphone au (235) 30031414 / 65173434, ou en vous présentant à notre accueil. Notre équipe confirmera votre rendez-vous dans les 24 heures et vous indiquera les documents à apporter.',
  },
  {
    question: 'Quels sont vos horaires d\'ouverture ?',
    answer: 'Notre clinique est ouverte du lundi au samedi de 8h00 à 18h00. Notre service d\'urgence est disponible 24h/24 et 7j/7 pour toute situation médicale urgente. En dehors des heures d\'ouverture, un médecin de garde reste joignable par téléphone.',
  },
  {
    question: 'Quelles assurances et mutuelles acceptez-vous ?',
    answer: 'Nous travaillons avec la plupart des organismes d\'assurance maladie et mutuelles. Nous vous recommandons de vérifier la prise en charge auprès de votre assureur avant votre consultation. Notre service administratif peut également vous accompagner dans vos démarches de remboursement.',
  },
  {
    question: 'Quels services d\'urgence proposez-vous ?',
    answer: 'Notre service des urgences est disponible 24h/24 et 7j/7. Il prend en charge les traumatismes, douleurs aiguës, détresses respiratoires, et toutes autres urgences médicales. Une équipe de médecins qualifiés est présente en permanence pour vous apporter des soins immédiats.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div>
            <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">FAQ</span>
            <h2 className="section-title mt-2">Toutes vos réponses en un seul endroit</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Retrouvez les réponses aux questions les plus fréquentes sur notre clinique, notre équipe et nos services. Pour toute autre question, n'hésitez pas à nous contacter.
            </p>
            <div className="bg-[#1D6FA4] text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-3">Vous avez d'autres questions ?</h3>
              <p className="text-blue-100 mb-6 text-sm">Notre équipe est disponible pour répondre à toutes vos questions concernant nos services de santé.</p>
              <a href="#contact" className="bg-white text-[#1D6FA4] px-6 py-2 rounded font-semibold text-sm hover:bg-blue-50 transition-colors inline-block">
                Nous contacter
              </a>
            </div>
          </div>

          {/* Right column — accordion */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
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
