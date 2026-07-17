'use client'

import { useState, useTransition } from 'react'
import { updateAboutSettings } from '@/lib/actions/admin-content'
import ImageUpload from '@/components/admin/ImageUpload'

export type AboutSettings = {
  about_title: string
  about_paragraph1: string
  about_paragraph2: string
  about_image: string
  about_badge1_value: string
  about_badge1_label: string
  about_badge2_value: string
  about_badge2_label: string
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function AboutSection({ settings }: { settings: AboutSettings }) {
  const [form, setForm] = useState<AboutSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const set = (key: keyof AboutSettings, value: string) => {
    setForm({ ...form, [key]: value })
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = await updateAboutSettings(form)
      if (r.ok) setSaved(true)
      else setError(r.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="font-bold text-gray-800">Section « À propos »</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input value={form.about_title} onChange={(e) => set('about_title', e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraphe 1</label>
        <textarea value={form.about_paragraph1} onChange={(e) => set('about_paragraph1', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraphe 2</label>
        <textarea value={form.about_paragraph2} onChange={(e) => set('about_paragraph2', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <ImageUpload value={form.about_image} onChange={(value) => set('about_image', value)} aspect="aspect-[4/3]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-700">Badge flottant 1</div>
          <input value={form.about_badge1_value} onChange={(e) => set('about_badge1_value', e.target.value)} placeholder="15+" className={inputClass} />
          <input value={form.about_badge1_label} onChange={(e) => set('about_badge1_label', e.target.value)} placeholder="Années d'excellence" className={inputClass} />
        </div>
        <div className="border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-700">Badge flottant 2</div>
          <input value={form.about_badge2_value} onChange={(e) => set('about_badge2_value', e.target.value)} placeholder="500+" className={inputClass} />
          <input value={form.about_badge2_label} onChange={(e) => set('about_badge2_label', e.target.value)} placeholder="Patients satisfaits" className={inputClass} />
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
        <button type="submit" disabled={pending} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-60">
          {pending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
