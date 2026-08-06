import 'server-only'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'
import type { Role } from '@/lib/generated/prisma/enums'

export type CurrentUser = {
  id: number
  name: string
  email: string
  role: Role
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Crée une session en base et pose le cookie httpOnly.
export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)
  const session = await prisma.session.create({ data: { userId, expiresAt } })
  const store = await cookies()
  store.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

// Supprime la session courante (BD + cookie).
export async function destroySession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await prisma.session.deleteMany({ where: { id: token } })
    store.delete(SESSION_COOKIE)
  }
}

// Renvoie l'utilisateur connecté (session valide + compte actif), sinon null.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({ where: { id: token }, include: { user: true } })
  if (!session || session.expiresAt < new Date() || !session.user.active) return null

  const { id, name, email, role } = session.user
  return { id, name, email, role }
}
