'use client'

import { useState, useRef, useTransition } from 'react'
import { submitApplication } from '@/lib/actions/job-applications'

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function JobApplicationForm({ offerId }: { offerId: number }) {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await submitApplication(formData)
      if (result.ok) {
        setSent(true)
        formRef.current?.reset()
      } else {
        setError(result.error)
      }
    })
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Candidature envoyée !</h3>
        <p className="text-gray-500 text-sm">Merci, notre équipe RH étudiera votre candidature et vous recontactera.</p>
        <button onClick={() => setSent(false)} className="mt-5 text-[#1D6FA4] text-sm font-semibold hover:underline">
          Envoyer une autre candidature
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="offerId" value={offerId} />
      <h3 className="text-lg font-bold text-gray-800">Postuler à cette offre</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
          <input type="text" name="name" required placeholder="Votre nom complet" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" name="email" required placeholder="votre@email.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input type="tel" name="phone" placeholder="+235 XX XX XX XX" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lettre de motivation</label>
        <textarea name="message" rows={4} placeholder="Présentez-vous en quelques lignes..." className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CV (PDF, DOC ou DOCX, max 4 Mo)</label>
        <input
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="block w-full text-sm text-gray-500 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#1D6FA4] file:text-sm file:font-semibold hover:file:bg-blue-100 file:cursor-pointer"
        />
      </div>
      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Envoi en cours...' : 'Envoyer ma candidature'}
      </button>
    </form>
  )
}
