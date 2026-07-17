'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type SubscribeResult = { ok: true } | { ok: false; error: string }

export async function subscribeNewsletter(formData: FormData): Promise<SubscribeResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Adresse email invalide.' }
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    })
  } catch (e) {
    console.error('subscribeNewsletter:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function deleteSubscriber(id: number) {
  await prisma.newsletterSubscriber.delete({ where: { id } })
  revalidatePath('/admin', 'layout')
}

export async function toggleSubscriberActive(id: number) {
  const sub = await prisma.newsletterSubscriber.findUnique({ where: { id } })
  if (!sub) return
  await prisma.newsletterSubscriber.update({ where: { id }, data: { active: !sub.active } })
  revalidatePath('/admin', 'layout')
}
