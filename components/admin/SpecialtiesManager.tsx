'use client'

import { useState, useTransition } from 'react'
import {
  createSpecialty,
  updateSpecialty,
  toggleSpecialtyActive,
  deleteSpecialty,
  type SpecialtyInput,
} from '@/lib/actions/admin-specialties'
import { specialtyColorPalette } from '@/components/specialty-assets'

export type SpecialtyRow = {
  id: number
  title: string
  description: string
  icon: string | null
  color: string
  active: boolean
}

const emptyForm: SpecialtyInput = {
  title: '',
  description: '',
  icon: null,
  color: specialtyColorPalette[0].value,
  active: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function SpecialtiesManager({ specialties }: { specialties: SpecialtyRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<SpecialtyInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (s: SpecialtyRow) => {
    setEditingId(s.id)
    setForm({ title: s.title, description: s.description, icon: s.icon, color: s.color, active: s.active })
    setError(null)
    setModalOpen(true)
  }

  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      setError('Veuillez choisir un fichier .svg')
      e.target.value = ''
      return
    }
    if (file.size > 100 * 1024) {
      setError('Le fichier SVG dépasse 100 Ko.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setError(null)
      setForm((f) => ({ ...f, icon: String(reader.result).trim() }))
    }
    reader.readAsText(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = editingId === null ? await createSpecialty(form) : await updateSpecialty(editingId, form)
      if (result.ok) {
        setModalOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  const handleToggle = (id: number) => {
    startTransition(async () => {
      await toggleSpecialtyActive(id)
    })
  }

  const handleDelete = (s: SpecialtyRow) => {
    if (!window.confirm(`Supprimer la spécialité « ${s.title} » ? Cette action est irréversible.`)) return
    startTransition(async () => {
      const result = await deleteSpecialty(s.id)
      if (!result.ok) window.alert(result.error)
    })
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Spécialités</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les {specialties.length} spécialités médicales affichées sur le site.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter une spécialité
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">Spécialité</th>
                <th className="px-6 py-3 font-semibold hidden md:table-cell">Description</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {specialties.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5 ${s.color.split(' ').slice(0, 2).join(' ')}`}
                      >
                        {s.icon ? (
                          <span dangerouslySetInnerHTML={{ __html: s.icon }} />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-current opacity-50" />
                        )}
                      </span>
                      <span className="font-medium text-gray-800">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell max-w-md truncate">{s.description}</td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => handleToggle(s.id)}
                      disabled={pending}
                      title={s.active ? 'Cliquer pour masquer' : 'Cliquer pour publier'}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        s.active
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {s.active ? 'Publiée' : 'Masquée'}
                    </button>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                        aria-label="Modifier"
                        title="Modifier"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ajout / édition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Ajouter une spécialité' : 'Modifier la spécialité'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Dermatologie"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description affichée sur le site public..."
                  rows={3}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône (fichier .svg)</label>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100 [&_svg]:w-8 [&_svg]:h-8 ${form.color.split(' ').slice(0, 2).join(' ')}`}
                  >
                    {form.icon ? (
                      <span dangerouslySetInnerHTML={{ __html: form.icon }} />
                    ) : (
                      <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept=".svg,image/svg+xml"
                      onChange={handleIconFile}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#1D6FA4] file:text-sm file:font-semibold hover:file:bg-blue-100 file:cursor-pointer"
                    />
                    {form.icon && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, icon: null })}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Retirer l&apos;icône (utiliser l&apos;icône par défaut)
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <div className="flex items-center gap-3">
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className={`${inputClass} bg-white`}
                  >
                    {specialtyColorPalette.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <span className={`w-10 h-10 rounded-lg flex-shrink-0 border border-gray-100 ${form.color.split(' ')[0]}`} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-gray-300 text-[#1D6FA4] focus:ring-[#1D6FA4]"
                />
                Publiée sur le site
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
