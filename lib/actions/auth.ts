'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession, verifyPassword } from '@/lib/session'

export type LoginResult = { ok: false; error: string } | undefined

export async function login(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, error: 'Email ou mot de passe incorrect.' }
  }

  await createSession(user.id)
  redirect('/admin')
}

export async function logout() {
  await destroySession()
  redirect('/admin/login')
}
