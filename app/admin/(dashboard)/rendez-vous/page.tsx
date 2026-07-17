import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'
import { prisma } from '@/lib/prisma'
import { updateAppointmentStatus, deleteAppointment } from '@/lib/actions/admin-appointments'
import { AppointmentStatus } from '@/lib/generated/prisma/enums'

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
}

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-600',
  CONFIRMED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-gray-100 text-gray-500',
}

const filters: { label: string; value?: AppointmentStatus }[] = [
  { label: 'Tous' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Confirmés', value: 'CONFIRMED' },
  { label: 'Annulés', value: 'CANCELLED' },
  { label: 'Terminés', value: 'COMPLETED' },
]

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d)
}

export default async function AdminAppointments({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>
}) {
  const { statut } = await searchParams
  const activeFilter = filters.find((f) => f.value === statut)?.value

  const appointments = await prisma.appointment.findMany({
    where: activeFilter ? { status: activeFilter } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <PageHeader
        title="Rendez-vous"
        subtitle="Consultez et traitez les demandes de rendez-vous envoyées depuis le site."
      />

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => {
          const isActive = f.value === activeFilter || (!f.value && !activeFilter)
          return (
            <Link
              key={f.label}
              href={f.value ? `/admin/rendez-vous?statut=${f.value}` : '/admin/rendez-vous'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#1D6FA4] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Aucune demande de rendez-vous{activeFilter ? ' pour ce filtre' : ''} pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Patient</th>
                  <th className="px-6 py-3 font-semibold hidden lg:table-cell">Contact</th>
                  <th className="px-6 py-3 font-semibold">Spécialité</th>
                  <th className="px-6 py-3 font-semibold">Date souhaitée</th>
                  <th className="px-6 py-3 font-semibold hidden xl:table-cell">Message</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">{a.name}</td>
                    <td className="px-6 py-3.5 text-gray-500 hidden lg:table-cell">
                      <div>{a.email}</div>
                      {a.phone && <div className="text-xs text-gray-400">{a.phone}</div>}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{a.specialty}</td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(a.date)}</td>
                    <td className="px-6 py-3.5 text-gray-500 hidden xl:table-cell max-w-xs truncate">
                      {a.message ?? '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[a.status]}`}>
                        {statusLabels[a.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {a.status === 'PENDING' && (
                          <>
                            <form action={updateAppointmentStatus.bind(null, a.id, 'CONFIRMED' as AppointmentStatus)}>
                              <button
                                type="submit"
                                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                aria-label="Confirmer"
                                title="Confirmer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </button>
                            </form>
                            <form action={updateAppointmentStatus.bind(null, a.id, 'CANCELLED' as AppointmentStatus)}>
                              <button
                                type="submit"
                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Annuler"
                                title="Annuler"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </form>
                          </>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <form action={updateAppointmentStatus.bind(null, a.id, 'COMPLETED' as AppointmentStatus)}>
                            <button
                              type="submit"
                              className="p-2 rounded-lg text-gray-400 hover:text-[#1D6FA4] hover:bg-blue-50 transition-colors"
                              aria-label="Marquer comme terminé"
                              title="Marquer comme terminé"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </form>
                        )}
                        <form action={deleteAppointment.bind(null, a.id)}>
                          <button
                            type="submit"
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Supprimer"
                            title="Supprimer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </form>
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
