'use client'

import { useState, useTransition } from 'react'
import { updateSectionHeadings } from '@/lib/actions/admin-content'
import {
  SECTION_DEFINITIONS,
  SECTION_KEYS,
  settingKey,
  type SectionField,
  type SectionHeadings,
} from '@/lib/section-headings'

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

const fieldLabels: Record<SectionField, string> = {
  eyebrow: 'Surtitre',
  title: 'Titre',
  subtitle: 'Sous-titre',
}

export default function SectionHeadingsSection({ headings }: { headings: SectionHeadings }) {
  const [form, setForm] = useState<SectionHeadings>(headings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const set = (section: keyof SectionHeadings, field: SectionField, value: string) => {
    setForm({ ...form, [section]: { ...form[section], [field]: value } })
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const values: Record<string, string> = {}
    for (const section of SECTION_KEYS) {
      for (const field of SECTION_DEFINITIONS[section].fields as SectionField[]) {
        values[settingKey(section, field)] = form[section][field]
      }
    }
    startTransition(async () => {
      const r = await updateSectionHeadings(values)
      if (r.ok) setSaved(true)
      else setError(r.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div>
        <h2 className="font-bold text-gray-800">En-têtes des sections (page d&apos;accueil)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Textes affichés au-dessus de chaque section. Laissez un champ vide pour rétablir le texte par défaut.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {SECTION_KEYS.map((section) => {
          const def = SECTION_DEFINITIONS[section]
          return (
            <div key={section} className="border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="text-sm font-semibold text-gray-700">{def.label}</div>
              {(def.fields as SectionField[]).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{fieldLabels[field]}</label>
                  {field === 'subtitle' ? (
                    <textarea
                      value={form[section][field]}
                      onChange={(e) => set(section, field, e.target.value)}
                      rows={3}
                      placeholder={def.defaults[field]}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <input
                      value={form[section][field]}
                      onChange={(e) => set(section, field, e.target.value)}
                      placeholder={def.defaults[field]}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-60"
        >
          {pending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
