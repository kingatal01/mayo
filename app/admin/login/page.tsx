'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await login(formData)
      if (result && !result.ok) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-[#0d2d6b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1D6FA4] rounded-2xl flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-white">Mayo Klinic</h1>
          <p className="text-blue-200 text-sm mt-1 uppercase tracking-widest">Espace Administration</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Connexion</h2>
          <p className="text-sm text-gray-500 mb-6">Connectez-vous pour gérer le contenu du site.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@mayoklinic.td"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FA4] focus:border-transparent"
              />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
            <button
              type="submit"
              disabled={pending}
              className="block w-full bg-[#1D6FA4] text-white text-center px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#175a86] transition-colors disabled:opacity-60"
            >
              {pending ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Retour au site</Link>
        </p>
      </div>
    </div>
  )
}
