'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { hashPassword, getCurrentUser } from '@/lib/session'
import type { Role } from '@/lib/generated/prisma/enums'

export type UserActionResult = { ok: true } | { ok: false; error: string }

export type UserInput = {
  name: string
  email: string
  role: Role
  password: string // vide en édition = mot de passe inchangé
}

// Seuls les ADMIN peuvent gérer les comptes.
async function requireAdmin(): Promise<UserActionResult> {
  const me = await getCurrentUser()
  if (!me) return { ok: false, error: 'Session expirée.' }
  if (me.role !== 'ADMIN') return { ok: false, error: 'Réservé aux administrateurs.' }
  return { ok: true }
}

function validate(data: UserInput, requirePassword: boolean): string | null {
  if (!data.name.trim()) return 'Le nom est obligatoire.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return 'Email invalide.'
  if (requirePassword && data.password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (data.password && data.password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.'
  return null
}

function revalidate() {
  revalidatePath('/admin', 'layout')
}

export async function createUser(data: UserInput): Promise<UserActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  const error = validate(data, true)
  if (error) return { ok: false, error }

  try {
    await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        passwordHash: await hashPassword(data.password),
      },
    })
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'P2002') {
      return { ok: false, error: 'Un compte avec cet email existe déjà.' }
    }
    console.error('createUser:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function updateUser(id: number, data: UserInput): Promise<UserActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  const error = validate(data, false)
  if (error) return { ok: false, error }

  // Empêche de rétrograder le dernier administrateur.
  if (data.role !== 'ADMIN') {
    const target = await prisma.user.findUnique({ where: { id } })
    if (target?.role === 'ADMIN') {
      const admins = await prisma.user.count({ where: { role: 'ADMIN', active: true } })
      if (admins <= 1) return { ok: false, error: 'Impossible : au moins un administrateur actif est requis.' }
    }
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        ...(data.password ? { passwordHash: await hashPassword(data.password) } : {}),
      },
    })
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'P2002') {
      return { ok: false, error: 'Un compte avec cet email existe déjà.' }
    }
    console.error('updateUser:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function toggleUserActive(id: number): Promise<UserActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return { ok: false, error: 'Compte introuvable.' }
    if (user.active && user.role === 'ADMIN') {
      const admins = await prisma.user.count({ where: { role: 'ADMIN', active: true } })
      if (admins <= 1) return { ok: false, error: 'Impossible : au moins un administrateur actif est requis.' }
    }
    await prisma.user.update({ where: { id }, data: { active: !user.active } })
    if (user.active) await prisma.session.deleteMany({ where: { userId: id } }) // désactivation → déconnexion
  } catch (e) {
    console.error('toggleUserActive:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function deleteUser(id: number): Promise<UserActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  const me = await getCurrentUser()
  if (me && me.id === id) return { ok: false, error: 'Vous ne pouvez pas supprimer votre propre compte.' }

  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return { ok: false, error: 'Compte introuvable.' }
    if (user.role === 'ADMIN') {
      const admins = await prisma.user.count({ where: { role: 'ADMIN', active: true } })
      if (admins <= 1) return { ok: false, error: 'Impossible : au moins un administrateur actif est requis.' }
    }
    await prisma.user.delete({ where: { id } })
  } catch (e) {
    console.error('deleteUser:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}
