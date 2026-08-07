'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession, verifyPassword } from '@/lib/session'

export type LoginResult = { ok: false; error: string } | undefined

// Masque le mot de passe du DATABASE_URL pour les logs.
function safeDbTarget(): string {
  try {
    const u = new URL(process.env.DATABASE_URL ?? '')
    return `${u.protocol}//${u.username}@${u.host}${u.pathname}`
  } catch {
    return '(DATABASE_URL absent ou invalide)'
  }
}

export async function login(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  // 1) Accès base de données (échec = souci de connexion / permissions / tables absentes)
  let user
  try {
    user = await prisma.user.findUnique({ where: { email } })
  } catch (e) {
    console.error('[login] ÉCHEC accès base de données :', safeDbTarget())
    console.error('[login] détail :', e)
    return {
      ok: false,
      error: 'Erreur de connexion à la base de données. Vérifiez la configuration du serveur (DATABASE_URL) puis réessayez.',
    }
  }

  // 2) Vérification des identifiants
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    console.warn(`[login] tentative échouée pour "${email}" (utilisateur ${user ? 'trouvé' : 'introuvable'})`)
    return { ok: false, error: 'Email ou mot de passe incorrect.' }
  }

  // 3) Création de la session
  try {
    await createSession(user.id)
  } catch (e) {
    console.error('[login] ÉCHEC création de session :', e)
    return { ok: false, error: 'Connexion validée mais la session n’a pas pu être créée. Réessayez.' }
  }

  console.info(`[login] succès : ${email}`)
  redirect('/admin')
}

export async function logout() {
  await destroySession()
  redirect('/admin/login')
}
