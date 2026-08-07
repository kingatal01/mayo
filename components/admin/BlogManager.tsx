'use client'

import { useState, useTransition } from 'react'
import {
  createBlogPost,
  updateBlogPost,
  toggleBlogPublished,
  deleteBlogPost,
  type BlogInput,
} from '@/lib/actions/admin-blog'

export type BlogRow = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  content: string | null
  color: string
  readTime: string
  published: boolean
  publishedAt: Date | null
}

export const blogColorPalette = [
  { label: 'Bleu', value: 'from-blue-400 to-blue-600' },
  { label: 'Turquoise', value: 'from-teal-400 to-teal-600' },
  { label: 'Violet', value: 'from-purple-400 to-purple-600' },
  { label: 'Ambre', value: 'from-amber-400 to-amber-600' },
  { label: 'Vert', value: 'from-green-400 to-green-600' },
  { label: 'Rose', value: 'from-pink-400 to-pink-600' },
  { label: 'Rouge', value: 'from-red-400 to-red-600' },
  { label: 'Indigo', value: 'from-indigo-400 to-indigo-600' },
]

const emptyForm: BlogInput = {
  title: '',
  category: '',
  excerpt: '',
  content: '',
  color: blogColorPalette[0].value,
  readTime: '5 min de lecture',
  published: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

function formatDate(d: Date | null) {
  if (!d) return '-'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(d),
  )
}

export default function BlogManager({ posts }: { posts: BlogRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<BlogInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (p: BlogRow) => {
    setEditingId(p.id)
    setForm({
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      content: p.content ?? '',
      color: p.color,
      readTime: p.readTime,
      published: p.published,
    })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = editingId === null ? await createBlogPost(form) : await updateBlogPost(editingId, form)
      if (result.ok) {
        setModalOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  const handleToggle = (id: number) => {
    startTransition(async () => {
      await toggleBlogPublished(id)
    })
  }

  const handleDelete = (p: BlogRow) => {
    if (!window.confirm(`Supprimer l'article « ${p.title} » ? Cette action est irréversible.`)) return
    startTransition(async () => {
      const result = await deleteBlogPost(p.id)
      if (!result.ok) window.alert(result.error)
    })
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Rédigez et gérez les articles de la section « Dernières Actualités ».
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvel article
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Aucun article pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Article</th>
                  <th className="px-6 py-3 font-semibold">Catégorie</th>
                  <th className="px-6 py-3 font-semibold hidden sm:table-cell">Date de publication</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-9 rounded-lg bg-gradient-to-br ${p.color} flex-shrink-0`} />
                        <span className="font-medium text-gray-800">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="bg-blue-50 text-[#1D6FA4] px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {formatDate(p.publishedAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleToggle(p.id)}
                        disabled={pending}
                        title={p.published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          p.published
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {p.published ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {p.published && (
                          <a
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                            aria-label="Voir l'article"
                            title="Voir l'article"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                          aria-label="Modifier"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
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
        )}
      </div>

      {/* Modal ajout / édition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Nouvel article' : "Modifier l'article"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Titre de l'article"
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ex : Prévention"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="5 min de lecture"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extrait *</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Court résumé affiché dans la liste des articles..."
                  rows={2}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu de l&apos;article</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Contenu complet affiché sur la page de l'article..."
                  rows={8}
                  className={`${inputClass} resize-y`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur de la vignette</label>
                <div className="flex items-center gap-3">
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className={`${inputClass} bg-white`}
                  >
                    {blogColorPalette.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <span className={`w-16 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${form.color}`} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-gray-300 text-[#1D6FA4] focus:ring-[#1D6FA4]"
                />
                Publié sur le site
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
