'use client'

import { useTransition } from 'react'
import { updateApplicationStatus, deleteApplication } from '@/lib/actions/job-applications'
import { applicationStatusLabels, applicationStatusStyles } from '@/lib/jobs'
import type { ApplicationStatus } from '@/lib/generated/prisma/enums'

export type ApplicationRow = {
  id: number
  name: string
  email: string
  phone: string | null
  message: string | null
  hasCv: boolean
  status: ApplicationStatus
  createdAt: Date
  offerTitle: string
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

const statuses = Object.keys(applicationStatusLabels) as ApplicationStatus[]

export default function ApplicationsManager({ applications }: { applications: ApplicationRow[] }) {
  const [pending, startTransition] = useTransition()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Candidatures</h1>
        <p className="text-sm text-gray-500 mt-1">Candidatures reçues via les offres d&apos;emploi.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Aucune candidature pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Candidat</th>
                  <th className="px-6 py-3 font-semibold hidden lg:table-cell">Offre</th>
                  <th className="px-6 py-3 font-semibold">Reçue le</th>
                  <th className="px-6 py-3 font-semibold">CV</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 align-top">
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-gray-800">{a.name}</div>
                      <div className="text-xs text-gray-400">{a.email}</div>
                      {a.phone && <div className="text-xs text-gray-400">{a.phone}</div>}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 hidden lg:table-cell">{a.offerTitle}</td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(a.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      {a.hasCv ? (
                        <a
                          href={`/api/cv/${a.id}`}
                          className="inline-flex items-center gap-1 text-[#1D6FA4] font-medium hover:underline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Télécharger
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">Aucun</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={a.status}
                        onChange={(e) =>
                          startTransition(async () =>
                            void (await updateApplicationStatus(a.id, e.target.value as ApplicationStatus)),
                          )
                        }
                        disabled={pending}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${applicationStatusStyles[a.status]}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{applicationStatusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer la candidature de ${a.name} ?`)) {
                              startTransition(async () => void (await deleteApplication(a.id)))
                            }
                          }}
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
    </div>
  )
}
