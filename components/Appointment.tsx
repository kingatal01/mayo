'use client'

import { useState, useTransition } from 'react'
import { createAppointment } from '@/lib/actions/appointments'

export type AppointmentSettings = {
  phone: string
  email: string
  address: string
  hours: string
  latitude: string
  longitude: string
}

export default function Appointment({
  specialties,
  settings,
}: {
  specialties: string[]
  settings: AppointmentSettings
}) {
  const LAT = settings.latitude
  const LNG = settings.longitude
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialty: '', date: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createAppointment(formData)
      if (result.ok) {
        setSent(true)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <section id="appointment" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Réservation</span>
          <h2 className="section-title mt-2">Prendre Rendez-vous</h2>
          <p className="section-subtitle">
            Remplissez le formulaire ci-dessous et notre équipe confirmera votre rendez-vous dans les 24 heures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Map + Contact info */}
          <div className="flex flex-col gap-6">
            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-80 lg:h-96">
              <iframe
                title="Localisation Mayo Klinic"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${LAT},${LNG}&z=17&output=embed`}
              />
            </div>

            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  ),
                  label: 'Notre Adresse',
                  value: settings.address,
                  href: `https://www.google.com/maps?q=${LAT},${LNG}`,
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
                    </svg>
                  ),
                  label: 'Téléphone',
                  value: settings.phone,
                  href: `tel:${settings.phone.split('/')[0].replace(/[^0-9+]/g, '')}`,
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  ),
                  label: 'Email',
                  value: settings.email,
                  href: `mailto:${settings.email}`,
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: 'Horaires',
                  value: settings.hours,
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-[#1D6FA4] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sm text-gray-700 font-medium hover:text-[#1D6FA4] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-700 font-medium">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Directions button */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-[#1D6FA4] text-[#1D6FA4] px-6 py-3 rounded-lg font-semibold hover:bg-[#1D6FA4] hover:text-white transition-colors duration-200 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              Obtenir l'itinéraire
            </a>
          </div>

          {/* Right — Appointment form */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Demande envoyée !</h3>
                <p className="text-gray-500 text-sm">Nous confirmerons votre rendez-vous dans les 24 heures.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', specialty: '', date: '', message: '' }) }}
                  className="mt-6 text-[#1D6FA4] text-sm font-semibold hover:underline"
                >
                  Nouveau rendez-vous
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Informations du rendez-vous</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange} required
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange} required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+235 XX XX XX XX"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                    <input
                      type="date" name="date" value={form.date} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <select
                    name="specialty" value={form.specialty} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent bg-white"
                  >
                    <option value="">Choisir une spécialité...</option>
                    {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Décrivez vos symptômes ou la raison de votre visite..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent resize-none"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
                )}
                <button type="submit" disabled={pending} className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {pending ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
