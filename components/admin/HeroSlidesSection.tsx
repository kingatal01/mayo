'use client'

import { useState, useTransition } from 'react'
import {
  createHeroSlide,
  updateHeroSlide,
  toggleHeroSlideActive,
  deleteHeroSlide,
  moveHeroSlide,
  type HeroSlideInput,
} from '@/lib/actions/admin-content'
import ImageUpload from '@/components/admin/ImageUpload'

export type HeroSlideRow = {
  id: number
  tag: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: string
  active: boolean
}

const emptyForm: HeroSlideInput = {
  tag: '',
  title: '',
  description: '',
  ctaLabel: 'En savoir plus',
  ctaHref: '#about',
  image: '/image_face.jpeg',
  active: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function HeroSlidesSection({ slides }: { slides: HeroSlideRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<HeroSlideInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (s: HeroSlideRow) => {
    setEditingId(s.id)
    setForm({
      tag: s.tag,
      title: s.title,
      description: s.description,
      ctaLabel: s.ctaLabel,
      ctaHref: s.ctaHref,
      image: s.image,
      active: s.active,
    })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = editingId === null ? await createHeroSlide(form) : await updateHeroSlide(editingId, form)
      if (r.ok) setModalOpen(false)
      else setError(r.error)
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800">Slides du Hero (bandeau principal)</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {slides.map((s, i) => (
          <div key={s.id} className="flex items-start gap-3 border border-gray-100 rounded-xl p-4">
            <div className="flex flex-col flex-shrink-0">
              <button
                onClick={() => startTransition(async () => void (await moveHeroSlide(s.id, 'up')))}
                disabled={pending || i === 0}
                className="p-0.5 text-gray-400 hover:text-[#1D6FA4] disabled:opacity-30"
                aria-label="Monter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
              <button
                onClick={() => startTransition(async () => void (await moveHeroSlide(s.id, 'down')))}
                disabled={pending || i === slides.length - 1}
                className="p-0.5 text-gray-400 hover:text-[#1D6FA4] disabled:opacity-30"
                aria-label="Descendre"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-w-0">
              {s.tag && <div className="text-xs text-[#1D6FA4] font-medium">{s.tag}</div>}
              <div className="font-bold text-gray-800 truncate">{s.title}</div>
              <div className="text-sm text-gray-500 line-clamp-1">{s.description}</div>
              <div className="text-xs text-gray-400 mt-1">
                Bouton : « {s.ctaLabel} » → {s.ctaHref} · Image : {s.image}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => startTransition(async () => void (await toggleHeroSlideActive(s.id)))}
                disabled={pending}
                title={s.active ? 'Cliquer pour masquer' : 'Cliquer pour afficher'}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  s.active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s.active ? 'Actif' : 'Masqué'}
              </button>
              <button
                onClick={() => openEdit(s)}
                className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                aria-label="Modifier"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Supprimer le slide « ${s.title} » ?`)) {
                    startTransition(async () => void (await deleteHeroSlide(s.id)))
                  }
                }}
                disabled={pending}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Aucun slide.</p>}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Ajouter un slide' : 'Modifier le slide'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Étiquette (petit texte au-dessus)</label>
                <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Bienvenue à Mayo Klinic" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Votre Santé est Notre Priorité" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                  <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="En savoir plus" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lien du bouton</label>
                  <input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} placeholder="#about" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image de fond</label>
                <ImageUpload value={form.image} onChange={(value) => setForm({ ...form, image: value })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300 text-[#1D6FA4] focus:ring-[#1D6FA4]" />
                Actif (affiché sur le site)
              </label>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={pending} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-60">
                  {pending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
