'use client'

import { useState, useTransition } from 'react'
import {
  createFaq,
  updateFaq,
  toggleFaqActive,
  deleteFaq,
  moveFaq,
  type FaqInput,
} from '@/lib/actions/admin-faqs'

export type FaqRow = {
  id: number
  question: string
  answer: string
  active: boolean
}

const emptyForm: FaqInput = {
  question: '',
  answer: '',
  active: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function FaqsManager({ faqs }: { faqs: FaqRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FaqInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (f: FaqRow) => {
    setEditingId(f.id)
    setForm({ question: f.question, answer: f.answer, active: f.active })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = editingId === null ? await createFaq(form) : await updateFaq(editingId, form)
      if (result.ok) {
        setModalOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  const handleToggle = (id: number) => {
    startTransition(async () => {
      await toggleFaqActive(id)
    })
  }

  const handleMove = (id: number, direction: 'up' | 'down') => {
    startTransition(async () => {
      await moveFaq(id, direction)
    })
  }

  const handleDelete = (f: FaqRow) => {
    if (!window.confirm(`Supprimer la question « ${f.question} » ? Cette action est irréversible.`)) return
    startTransition(async () => {
      const result = await deleteFaq(f.id)
      if (!result.ok) window.alert(result.error)
    })
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">FAQ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les questions fréquentes affichées sur le site. Utilisez les flèches pour les réordonner.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter une question
        </button>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={f.id} className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
            {/* Flèches de réordonnancement */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                onClick={() => handleMove(f.id, 'up')}
                disabled={pending || i === 0}
                className="p-1 rounded text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Monter"
                title="Monter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
              <button
                onClick={() => handleMove(f.id, 'down')}
                disabled={pending || i === faqs.length - 1}
                className="p-1 rounded text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Descendre"
                title="Descendre"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D6FA4] flex items-center justify-center font-bold text-sm flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 mb-1">{f.question}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.answer}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleToggle(f.id)}
                disabled={pending}
                title={f.active ? 'Cliquer pour masquer' : 'Cliquer pour afficher'}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  f.active
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.active ? 'Visible' : 'Masquée'}
              </button>
              <button
                onClick={() => openEdit(f)}
                className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                aria-label="Modifier"
                title="Modifier"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(f)}
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
        ))}
        {faqs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400 text-sm">
            Aucune question pour le moment.
          </div>
        )}
      </div>

      {/* Modal ajout / édition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Ajouter une question' : 'Modifier la question'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="Ex : Quels sont vos horaires ?"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réponse *</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="La réponse affichée sur le site..."
                  rows={5}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-gray-300 text-[#1D6FA4] focus:ring-[#1D6FA4]"
                />
                Visible sur le site
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
