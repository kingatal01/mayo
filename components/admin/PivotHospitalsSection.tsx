'use client'

import { useState, useTransition } from 'react'
import { updatePivotHospitals } from '@/lib/actions/admin-content'

// Édition de la liste des hôpitaux pivots (pages Entreprises & EVASAN).
export default function PivotHospitalsSection({ value }: { value: string }) {
  const [text, setText] = useState(value)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  const preview = text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const handleSave = () => {
    startTransition(async () => {
      const r = await updatePivotHospitals(text)
      if (r.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      } else {
        window.alert(r.error)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-gray-800 mb-1">Hôpitaux pivots (Entreprises & EVASAN)</h2>
      <p className="text-sm text-gray-500 mb-4">Destinations d’évacuation sanitaire, séparées par des virgules.</p>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setSaved(false)
        }}
        rows={2}
        placeholder="Tunis, Casablanca, Johannesburg, Nairobi, Europe, Turquie"
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent resize-none"
      />

      {preview.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {preview.map((h, i) => (
            <span key={`${h}-${i}`} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
              {h}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 mt-4">
        {saved && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
        <button
          onClick={handleSave}
          disabled={pending}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-60"
        >
          {pending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
