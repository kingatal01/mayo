'use client'

import { useState, useTransition } from 'react'
import { createStat, updateStat, deleteStat, moveStat } from '@/lib/actions/admin-content'
import { StatSection as StatSectionEnum } from '@/lib/generated/prisma/enums'

export type StatRow = { id: number; value: string; label: string }

const inputBase =
  'px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent'

function StatRowItem({
  stat,
  index,
  total,
}: {
  stat: StatRow
  index: number
  total: number
}) {
  const [value, setValue] = useState(stat.value)
  const [label, setLabel] = useState(stat.label)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  const dirty = value !== stat.value || label !== stat.label

  const save = () => {
    if (!dirty) return
    if (!value.trim() || !label.trim()) return
    startTransition(async () => {
      const r = await updateStat(stat.id, value, label)
      if (r.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      } else {
        window.alert(r.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col w-6 flex-shrink-0">
        <button
          onClick={() => startTransition(async () => void (await moveStat(stat.id, 'up')))}
          disabled={pending || index === 0}
          className="p-0.5 text-gray-400 hover:text-[#1D6FA4] disabled:opacity-30"
          aria-label="Monter"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          onClick={() => startTransition(async () => void (await moveStat(stat.id, 'down')))}
          disabled={pending || index === total - 1}
          className="p-0.5 text-gray-400 hover:text-[#1D6FA4] disabled:opacity-30"
          aria-label="Descendre"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        className={`${inputBase} w-24 flex-shrink-0 font-bold`}
        placeholder="500+"
      />
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={save}
        className={`${inputBase} flex-1 min-w-0`}
        placeholder="Ex : Patients traités"
      />
      <div className="w-6 flex-shrink-0 flex items-center justify-center">
        {saved ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : dirty ? (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Modifications non enregistrées" />
        ) : null}
      </div>
      <button
        onClick={() => {
          if (window.confirm('Supprimer cette statistique ?')) {
            startTransition(async () => void (await deleteStat(stat.id)))
          }
        }}
        disabled={pending}
        className="p-2 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
        aria-label="Supprimer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  )
}

export default function StatsSection({
  title,
  section,
  stats,
}: {
  title: string
  section: StatSectionEnum
  stats: StatRow[]
}) {
  const [newValue, setNewValue] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [pending, startTransition] = useTransition()

  const handleAdd = () => {
    if (!newValue.trim() || !newLabel.trim()) return
    startTransition(async () => {
      const r = await createStat({ section, value: newValue, label: newLabel })
      if (r.ok) {
        setNewValue('')
        setNewLabel('')
      } else {
        window.alert(r.error)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-gray-800 mb-4">{title}</h2>

      {/* En-têtes de colonnes */}
      {stats.length > 0 && (
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="w-6" />
          <span className="w-24 text-xs font-semibold text-gray-400 uppercase tracking-wide">Valeur</span>
          <span className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Libellé</span>
          <span className="w-6" />
          <span className="w-8" />
        </div>
      )}

      <div className="space-y-3">
        {stats.map((stat, i) => (
          <StatRowItem key={stat.id} stat={stat} index={i} total={stats.length} />
        ))}
        {stats.length === 0 && <p className="text-sm text-gray-400 text-center py-2">Aucune statistique.</p>}
      </div>

      {/* Ajout */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <span className="w-6 flex-shrink-0" />
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className={`${inputBase} w-24 flex-shrink-0 font-bold`}
          placeholder="100+"
        />
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className={`${inputBase} flex-1 min-w-0`}
          placeholder="Nouveau libellé"
        />
        <button
          onClick={handleAdd}
          disabled={pending || !newValue.trim() || !newLabel.trim()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1D6FA4] hover:bg-[#175a86] transition-colors disabled:opacity-50 flex-shrink-0"
        >
          Ajouter
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Modifiez une valeur ou un libellé puis cliquez ailleurs : l&apos;enregistrement est automatique (✓).
      </p>
    </div>
  )
}
