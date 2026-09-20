'use client'

import { useEffect, useState } from 'react'

export type AppointmentMessageProps = {
  name: string
  email: string
  phone: string | null
  specialty: string
  /** Date souhaitée, déjà formatée côté serveur. */
  date: string
  message: string | null
}

// Le message d'un patient tient rarement sur une ligne de tableau : on
// n'affiche qu'un aperçu cliquable qui ouvre le texte complet dans une modale.
export default function AppointmentMessage({ name, email, phone, specialty, date, message }: AppointmentMessageProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!message) return <span className="text-gray-300 text-xs">Aucun</span>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Voir le message complet"
        className="group flex items-center gap-2 text-left max-w-xs text-gray-500 hover:text-[#1D6FA4] transition-colors"
      >
        <svg className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-[#1D6FA4]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <span className="truncate group-hover:underline">{message}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Message de ${name}`}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {specialty} · {date}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="p-2 -mr-2 -mt-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
              <a href={`mailto:${email}`} className="hover:text-[#1D6FA4] hover:underline">
                {email}
              </a>
              {phone && (
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#1D6FA4] hover:underline">
                  {phone}
                </a>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {message}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
