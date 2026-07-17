import Link from 'next/link'
import { prisma } from '@/lib/prisma'
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

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d)
}

export default async function AdminDashboard() {
  const [pendingCount, specialtyCount, doctorCount, subscriberCount, blogCount, recentAppointments] =
    await Promise.all([
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.specialty.count({ where: { active: true } }),
      prisma.doctor.count({ where: { active: true } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.appointment.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ])

  const stats = [
    {
      label: 'Rendez-vous en attente',
      value: pendingCount,
      trend: 'À traiter',
      color: 'bg-amber-50 text-amber-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: 'Spécialités',
      value: specialtyCount,
      trend: 'Actives sur le site',
      color: 'bg-blue-50 text-[#1D6FA4]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      label: 'Médecins',
      value: doctorCount,
      trend: 'Publiés sur le site',
      color: 'bg-teal-50 text-teal-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Abonnés newsletter',
      value: subscriberCount,
      trend: 'Inscrits actifs',
      color: 'bg-purple-50 text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
  ]

  const quickLinks = [
    { label: 'Gérer les spécialités', href: '/admin/specialites', description: `${specialtyCount} spécialités actives` },
    { label: 'Gérer les médecins', href: '/admin/medecins', description: `${doctorCount} médecins publiés` },
    { label: 'Gérer le blog', href: '/admin/blog', description: `${blogCount} articles publiés` },
    { label: 'Paramètres du site', href: '/admin/parametres', description: 'Contacts, horaires, réseaux' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue dans l&apos;espace d&apos;administration de Mayo Klinic.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className="text-xs text-gray-400 mt-1">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Derniers rendez-vous */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Dernières demandes de rendez-vous</h2>
            <Link href="/admin/rendez-vous" className="text-sm text-[#1D6FA4] font-semibold hover:underline">
              Tout voir
            </Link>
          </div>
          {recentAppointments.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">Aucune demande pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-6 py-3 font-semibold">Patient</th>
                    <th className="px-6 py-3 font-semibold">Spécialité</th>
                    <th className="px-6 py-3 font-semibold">Date souhaitée</th>
                    <th className="px-6 py-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3.5 font-medium text-gray-800">{a.name}</td>
                      <td className="px-6 py-3.5 text-gray-500">{a.specialty}</td>
                      <td className="px-6 py-3.5 text-gray-500">{formatDate(a.date)}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[a.status]}`}>
                          {statusLabels[a.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Accès rapides */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Accès rapides</h2>
          <div className="space-y-3">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#1D6FA4] hover:bg-blue-50/40 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-gray-800 text-sm group-hover:text-[#1D6FA4]">{l.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{l.description}</div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1D6FA4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
