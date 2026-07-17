'use client'

import { useState, useTransition } from 'react'
import { updateSiteSettings } from '@/lib/actions/admin-settings'
import type { SiteSettings } from '@/lib/settings'

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState<SiteSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const set = (key: keyof SiteSettings, value: string) => {
    setForm({ ...form, [key]: value })
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = await updateSiteSettings(form)
      if (r.ok) setSaved(true)
      else setError(r.error)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paramètres du site</h1>
          <p className="text-sm text-gray-500 mt-1">
            Informations affichées sur le site public (barre supérieure, pied de page, contact).
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-60"
          >
            {pending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Coordonnées */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Coordonnées</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input value={form.latitude} onChange={(e) => set('latitude', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input value={form.longitude} onChange={(e) => set('longitude', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Horaires */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Horaires</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horaires d&apos;ouverture</label>
            <input value={form.hours} onChange={(e) => set('hours', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgences</label>
            <input value={form.emergency} onChange={(e) => set('emergency', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 xl:col-span-2">
          <h2 className="font-bold text-gray-800">Réseaux sociaux</h2>
          <p className="text-xs text-gray-400 -mt-2">Laissez vide pour masquer l&apos;icône correspondante sur le site.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input value={form.facebook} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
              <input value={form.twitter} onChange={(e) => set('twitter', e.target.value)} placeholder="https://x.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/..." className={inputClass} />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
