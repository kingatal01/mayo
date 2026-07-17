'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type CreateAppointmentResult = { ok: true } | { ok: false; error: string }

export async function createAppointment(formData: FormData): Promise<CreateAppointmentResult> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const specialty = String(formData.get('specialty') ?? '').trim()
  const date = String(formData.get('date') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !specialty || !date) {
    return { ok: false, error: 'Veuillez remplir tous les champs obligatoires.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Adresse email invalide.' }
  }
  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) {
    return { ok: false, error: 'Date invalide.' }
  }

  try {
    await prisma.appointment.create({
      data: {
        name,
        email,
        phone: phone || null,
        specialty,
        date: parsedDate,
        message: message || null,
      },
    })
  } catch (e) {
    console.error('createAppointment:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidatePath('/admin', 'layout')
  return { ok: true }
}
