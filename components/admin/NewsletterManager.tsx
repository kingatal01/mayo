'use client'

import { useTransition } from 'react'
import { deleteSubscriber, toggleSubscriberActive } from '@/lib/actions/newsletter'

export type SubscriberRow = {
  id: number
  email: string
  active: boolean
  createdAt: Date
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default function NewsletterManager({ subscribers }: { subscribers: SubscriberRow[] }) {
  const [pending, startTransition] = useTransition()

  const handleExport = () => {
    const rows = [['Email', 'Statut', "Date d'inscription"], ...subscribers.map((s) => [
      s.email,
      s.active ? 'Abonné' : 'Désabonné',
      formatDate(s.createdAt),
    ])]
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `abonnes-newsletter-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const active = subscribers.filter((s) => s.active).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-1">Liste des abonnés inscrits via le formulaire du site.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 bg-[#1D6FA4] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exporter (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total abonnés', value: subscribers.length },
          { label: 'Actifs', value: active },
          { label: 'Désabonnés', value: subscribers.length - active },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Aucun abonné pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Date d&apos;inscription</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-medium text-gray-800">{s.email}</td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => startTransition(async () => void (await toggleSubscriberActive(s.id)))}
                        disabled={pending}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          s.active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {s.active ? 'Abonné' : 'Désabonné'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer ${s.email} ?`)) {
                              startTransition(async () => void (await deleteSubscriber(s.id)))
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
