'use client'

import { useState, useTransition } from 'react'
import { createUser, updateUser, toggleUserActive, deleteUser, type UserInput } from '@/lib/actions/admin-users'
import type { Role } from '@/lib/generated/prisma/enums'

export type UserRow = {
  id: number
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: Date
}

const emptyForm: UserInput = { name: '', email: '', role: 'EDITOR', password: '' }

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

const roleLabels: Record<Role, string> = { ADMIN: 'Administrateur', EDITOR: 'Éditeur' }
const roleStyles: Record<Role, string> = {
  ADMIN: 'bg-[#1D6FA4]/10 text-[#1D6FA4]',
  EDITOR: 'bg-purple-50 text-purple-600',
}

export default function UsersManager({ users, currentUserId }: { users: UserRow[]; currentUserId: number }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<UserInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (u: UserRow) => {
    setEditingId(u.id)
    setForm({ name: u.name, email: u.email, role: u.role, password: '' })
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = editingId === null ? await createUser(form) : await updateUser(editingId, form)
      if (r.ok) setModalOpen(false)
      else setError(r.error)
    })
  }

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    startTransition(async () => {
      const r = await fn()
      if (!r.ok && r.error) window.alert(r.error)
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les comptes d&apos;accès à l&apos;administration et leurs rôles.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">Nom</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Rôle</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                    {u.name}
                    {u.id === currentUserId && <span className="ml-2 text-xs text-gray-400">(vous)</span>}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleStyles[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => act(() => toggleUserActive(u.id))}
                      disabled={pending}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        u.active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {u.active ? 'Actif' : 'Désactivé'}
                    </button>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                        aria-label="Modifier"
                        title="Modifier / réinitialiser le mot de passe"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer le compte « ${u.name} » ?`)) act(() => deleteUser(u.id))
                          }}
                          disabled={pending}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId === null ? 'Ajouter un utilisateur' : "Modifier l'utilisateur"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className={`${inputClass} bg-white`}>
                  <option value="ADMIN">Administrateur (accès complet + gestion des comptes)</option>
                  <option value="EDITOR">Éditeur (gestion du contenu)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingId === null ? 'Mot de passe *' : 'Nouveau mot de passe'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={editingId === null}
                  placeholder={editingId === null ? 'Au moins 6 caractères' : 'Laisser vide pour ne pas changer'}
                  className={inputClass}
                />
              </div>
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
