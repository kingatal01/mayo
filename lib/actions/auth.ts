'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkCredentials, SESSION_COOKIE, SESSION_VALUE } from '@/lib/auth'

export type LoginResult = { ok: false; error: string } | undefined

export async function login(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!checkCredentials(email, password)) {
    return { ok: false, error: 'Email ou mot de passe incorrect.' }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  })

  redirect('/admin')
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/admin/login')
}
