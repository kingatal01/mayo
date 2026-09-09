'use client'

import { useState, useTransition } from 'react'
import {
  createDoctor,
  updateDoctor,
  toggleDoctorActive,
  deleteDoctor,
  type DoctorInput,
} from '@/lib/actions/admin-doctors'
import { doctorColorPalette, doctorSocialIcons } from '@/components/doctor-assets'

export type DoctorRow = {
  id: number
  name: string
  specialty: string
  initials: string
  photo: string | null
  color: string
  facebook: string | null
  twitter: string | null
  linkedin: string | null
  active: boolean
}

const emptyForm: DoctorInput = {
  name: '',
  specialty: '',
  initials: '',
  photo: null,
  color: doctorColorPalette[0].value,
  facebook: '',
  twitter: '',
  linkedin: '',
  active: true,
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

export default function DoctorsManager({
  doctors,
  specialtyOptions,
}: {
  doctors: DoctorRow[]
  specialtyOptions: string[]
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<DoctorInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (d: DoctorRow) => {
    setEditingId(d.id)
    setForm({
      name: d.name,
      specialty: d.specialty,
      initials: d.initials,
      photo: d.photo,
      color: d.color,
      facebook: d.facebook ?? '',
      twitter: d.twitter ?? '',
      linkedin: d.linkedin ?? '',
      active: d.active,
    })
    setError(null)
    setModalOpen(true)
  }

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type)) {
      setError('Veuillez choisir une image PNG, JPG, WebP ou SVG.')
      e.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La photo dépasse 2 Mo.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setError(null)
      setForm((f) => ({ ...f, photo: String(reader.result) }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = editingId === null ? await createDoctor(form) : await updateDoctor(editingId, form)
      if (result.ok) {
        setModalOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  const handleToggle = (id: number) => {
    startTransition(async () => {
      await toggleDoctorActive(id)
    })
  }

  const handleDelete = (d: DoctorRow) => {
    if (!window.confirm(`Supprimer « ${d.name} » ? Cette action est irréversible.`)) return
    startTransition(async () => {
      const result = await deleteDoctor(d.id)
      if (!result.ok) window.alert(result.error)
    })
  }

  const socialCount = (d: DoctorRow) =>
    [d.facebook, d.twitter, d.linkedin].filter(Boolean).length

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notre Équipe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez l&apos;équipe médicale affichée dans la section « Notre Équipe » du site.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un médecin
        </button>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {doctors.map((d) => (
          <div key={d.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-4">
              {d.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={d.photo}
                  alt={d.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                />
              ) : (
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                  {d.initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{d.name}</h3>
                <p className="text-sm text-[#1D6FA4] truncate">{d.specialty}</p>
                <button
                  onClick={() => handleToggle(d.id)}
                  disabled={pending}
                  title={d.active ? 'Cliquer pour masquer' : 'Cliquer pour publier'}
                  className={`mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                    d.active
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {d.active ? 'Publié' : 'Masqué'}
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => openEdit(d)}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                  aria-label="Modifier"
                  title="Modifier"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(d)}
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
            {/* Liens sociaux */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
              {doctorSocialIcons.map((s) => {
                const url = d[s.key]
                return (
                  <span
                    key={s.key}
                    title={url ? `${s.label} : ${url}` : `${s.label} : non renseigné`}
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      url ? 'bg-blue-50 text-[#1D6FA4]' : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                    </svg>
                  </span>
                )
              })}
              <span className="text-xs text-gray-400 ml-1">
                {socialCount(d)} lien{socialCount(d) > 1 ? 's' : ''} social{socialCount(d) > 1 ? 'aux' : ''}
              </span>
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
              {editingId === null ? 'Ajouter un médecin' : 'Modifier le médecin'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Nom Prénom"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initiales</label>
                  <input
                    type="text"
                    value={form.initials}
                    onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase().slice(0, 2) })}
                    placeholder="Auto si vide"
                    maxLength={2}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité *</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  required
                  className={`${inputClass} bg-white`}
                >
                  <option value="">Choisir une spécialité...</option>
                  {specialtyOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  {form.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={form.photo}
                      alt="Aperçu"
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {form.initials || 'AB'}
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handlePhotoFile}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#1D6FA4] file:text-sm file:font-semibold hover:file:bg-blue-100 file:cursor-pointer"
                    />
                    {form.photo ? (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, photo: null })}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Retirer la photo (utiliser les initiales)
                      </button>
                    ) : (
                      <p className="text-xs text-gray-400">Sans photo, les initiales sont affichées.</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur de l&apos;avatar</label>
                <div className="flex items-center gap-3">
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className={`${inputClass} bg-white`}
                  >
                    {doctorColorPalette.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <span className={`w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${form.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {form.initials || 'AB'}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-sm font-semibold text-gray-700 mb-2">Liens sociaux (optionnels)</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={form.facebook}
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
                    <input
                      type="url"
                      value={form.twitter}
                      onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                      placeholder="https://x.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
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
