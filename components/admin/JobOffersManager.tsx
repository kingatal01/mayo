'use client'

import { useState, useTransition } from 'react'
import {
  createJobOffer,
  updateJobOffer,
  toggleJobPublished,
  deleteJobOffer,
  type JobInput,
} from '@/lib/actions/admin-jobs'
import { jobTypeLabels } from '@/lib/jobs'
import type { JobType } from '@/lib/generated/prisma/enums'

export type JobRow = {
  id: number
  title: string
  slug: string
  department: string
  location: string
  type: JobType
  description: string
  missions: string | null
  profile: string
  closingDate: Date | null
  published: boolean
  applicationsCount: number
}

const emptyForm: JobInput = {
  title: '',
  department: '',
  location: "N'Djamena, Tchad",
  type: 'CDI',
  description: '',
  missions: '',
  profile: '',
  closingDate: '',
  published: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

function toDateInput(d: Date | null) {
  if (!d) return ''
  return new Date(d).toISOString().slice(0, 10)
}

export default function JobOffersManager({ offers }: { offers: JobRow[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<JobInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (o: JobRow) => {
    setEditingId(o.id)
    setForm({
      title: o.title,
      department: o.department,
      location: o.location,
      type: o.type,
      description: o.description,
      missions: o.missions ?? '',
      profile: o.profile,
      closingDate: toDateInput(o.closingDate),
      published: o.published,
    })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = editingId === null ? await createJobOffer(form) : await updateJobOffer(editingId, form)
      if (r.ok) setModalOpen(false)
      else setError(r.error)
    })
  }

  const handleToggle = (id: number) => startTransition(async () => void (await toggleJobPublished(id)))

  const handleDelete = (o: JobRow) => {
    const warn =
      o.applicationsCount > 0
        ? `Supprimer l'offre « ${o.title} » et ses ${o.applicationsCount} candidature(s) ? Action irréversible.`
        : `Supprimer l'offre « ${o.title} » ?`
    if (!window.confirm(warn)) return
    startTransition(async () => {
      const r = await deleteJobOffer(o.id)
      if (!r.ok) window.alert(r.error)
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recrutement</h1>
          <p className="text-sm text-gray-500 mt-1">Publiez et gérez les offres d&apos;emploi.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvelle offre
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {offers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Aucune offre pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Offre</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Candidatures</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {offers.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-gray-800">{o.title}</div>
                      <div className="text-xs text-gray-400">{o.department}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="bg-blue-50 text-[#1D6FA4] px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {jobTypeLabels[o.type]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{o.applicationsCount}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleToggle(o.id)}
                        disabled={pending}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          o.published
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {o.published ? 'Publiée' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {o.published && (
                          <a
                            href={`/recrutement/${o.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                            title="Voir l'offre"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(o)}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(o)}
                          disabled={pending}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Nouvelle offre' : "Modifier l'offre"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intitulé du poste *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Ex : Médecin urgentiste" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                  <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required placeholder="Ex : Médical" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as JobType })} className={`${inputClass} bg-white`}>
                    {(Object.keys(jobTypeLabels) as JobType[]).map((t) => (
                      <option key={t} value={t}>{jobTypeLabels[t]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date limite de candidature</label>
                  <input type="date" value={form.closingDate} onChange={(e) => setForm({ ...form, closingDate: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Présentation du poste *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} placeholder="Contexte et présentation générale du poste..." className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Missions / tâches</label>
                <textarea value={form.missions} onChange={(e) => setForm({ ...form, missions: e.target.value })} rows={5} placeholder="Une tâche par ligne :&#10;Assurer la prise en charge des urgences&#10;Coordonner avec le bloc opératoire&#10;..." className={`${inputClass} resize-y`} />
                <p className="text-xs text-gray-400 mt-1">Une tâche par ligne : elles s&apos;affichent en liste à puces sur l&apos;offre.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profil recherché</label>
                <textarea value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} rows={4} placeholder="Diplômes, expérience, compétences..." className={`${inputClass} resize-y`} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300 text-[#1D6FA4] focus:ring-[#1D6FA4]" />
                Publiée sur le site
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
