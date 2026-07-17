'use client'

import { useState, useTransition } from 'react'
import {
  createTestimonial,
  updateTestimonial,
  toggleTestimonialApproved,
  deleteTestimonial,
  type TestimonialInput,
} from '@/lib/actions/admin-testimonials'
import { testimonialColorPalette } from '@/components/testimonial-assets'

export type TestimonialRow = {
  id: number
  name: string
  role: string
  text: string
  initials: string
  color: string
  rating: number
  approved: boolean
}

const emptyForm: TestimonialInput = {
  name: '',
  role: '',
  text: '',
  initials: '',
  color: testimonialColorPalette[0].value,
  rating: 5,
  approved: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s < count ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsManager({ testimonials }: { testimonials: TestimonialRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<TestimonialInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (t: TestimonialRow) => {
    setEditingId(t.id)
    setForm({
      name: t.name,
      role: t.role,
      text: t.text,
      initials: t.initials,
      color: t.color,
      rating: t.rating,
      approved: t.approved,
    })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result =
        editingId === null ? await createTestimonial(form) : await updateTestimonial(editingId, form)
      if (result.ok) {
        setModalOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  const handleToggle = (id: number) => {
    startTransition(async () => {
      await toggleTestimonialApproved(id)
    })
  }

  const handleDelete = (t: TestimonialRow) => {
    if (!window.confirm(`Supprimer le témoignage de « ${t.name} » ? Cette action est irréversible.`)) return
    startTransition(async () => {
      const result = await deleteTestimonial(t.id)
      if (!result.ok) window.alert(result.error)
    })
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Témoignages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Approuvez et gérez les témoignages de patients affichés sur le site.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un témoignage
        </button>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role || '—'}</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle(t.id)}
                disabled={pending}
                title={t.approved ? 'Cliquer pour masquer' : 'Cliquer pour approuver'}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  t.approved
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
              >
                {t.approved ? 'Approuvé' : 'En attente'}
              </button>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed italic flex-1">&quot;{t.text}&quot;</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <Stars count={t.rating} />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                  aria-label="Modifier"
                  title="Modifier"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  disabled={pending}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Supprimer"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal ajout / édition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Ajouter un témoignage' : 'Modifier le témoignage'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nom du patient"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Ex : Enseignant"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Témoignage *</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Le témoignage du patient..."
                  rows={4}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className={`${inputClass} bg-white`}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n}/5)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur de l&apos;avatar</label>
                  <div className="flex items-center gap-3">
                    <select
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className={`${inputClass} bg-white`}
                    >
                      {testimonialColorPalette.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <span className={`w-10 h-10 rounded-full flex-shrink-0 ${form.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {form.initials || form.name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AB'}
                    </span>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.approved}
                  onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                  className="rounded border-gray-300 text-[#1D6FA4] focus:ring-[#1D6FA4]"
                />
                Approuvé (visible sur le site)
              </label>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-60"
                >
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
