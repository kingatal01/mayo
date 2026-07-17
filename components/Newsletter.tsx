'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/lib/actions/newsletter'

export default function Newsletter({ phone }: { phone: string }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await subscribeNewsletter(formData)
      if (result.ok) {
        setSubmitted(true)
        setEmail('')
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <section className="py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Newsletter */}
        <div className="bg-[#1D6FA4] py-16 px-8 lg:px-16">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-white mb-3">Newsletter Mayo Klinic</h2>
            <p className="text-blue-100 mb-8 text-sm">
              Restez informé des derniers conseils santé, actualités de la clinique et avancées médicales. Inscrivez-vous dès aujourd'hui.
            </p>
            {submitted ? (
              <div className="bg-white/20 text-white rounded-lg px-6 py-4 text-sm font-medium">
                Merci pour votre inscription !
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  required
                  className="flex-1 px-4 py-3 rounded text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-white text-[#1D6FA4] px-6 py-3 rounded font-semibold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {pending ? '...' : "S'inscrire"}
                </button>
              </form>
            )}
            {error && (
              <div className="mt-3 bg-white/20 text-white rounded-lg px-4 py-2 text-sm">{error}</div>
            )}
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-[#0d4f7a] py-16 px-8 lg:px-16 flex items-center">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                </svg>
              </div>
              <div>
                <span className="text-blue-300 text-sm font-medium uppercase tracking-widest">Urgence</span>
                <h2 className="text-2xl font-bold text-white">Service d'urgence médicale 24h/24</h2>
              </div>
            </div>
            <p className="text-blue-200 mb-6 text-sm leading-relaxed">
              Notre équipe médicale d'urgence est disponible à toute heure. En cas d'urgence médicale, n'hésitez pas à nous appeler immédiatement.
            </p>
            <a
              href={`tel:${phone.split('/')[0].replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-3 bg-white text-[#1D6FA4] px-6 py-3 rounded font-bold hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
              </svg>
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
