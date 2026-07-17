'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type TestimonialInput = {
  name: string
  role: string
  text: string
  initials: string
  color: string
  rating: number
  approved: boolean
}

export type TestimonialActionResult = { ok: true } | { ok: false; error: string }

function validate(data: TestimonialInput): string | null {
  if (!data.name.trim()) return 'Le nom est obligatoire.'
  if (!data.text.trim()) return 'Le témoignage est obligatoire.'
  if (data.rating < 1 || data.rating > 5) return 'La note doit être comprise entre 1 et 5.'
  return null
}

function toInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function toData(data: TestimonialInput) {
  return {
    name: data.name.trim(),
    role: data.role.trim(),
    text: data.text.trim(),
    initials: data.initials.trim().toUpperCase() || toInitials(data.name),
    color: data.color,
    rating: data.rating,
    approved: data.approved,
  }
}

function revalidate() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

export async function createTestimonial(data: TestimonialInput): Promise<TestimonialActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    await prisma.testimonial.create({ data: toData(data) })
  } catch (e) {
    console.error('createTestimonial:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function updateTestimonial(id: number, data: TestimonialInput): Promise<TestimonialActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    await prisma.testimonial.update({ where: { id }, data: toData(data) })
  } catch (e) {
    console.error('updateTestimonial:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function toggleTestimonialApproved(id: number): Promise<TestimonialActionResult> {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } })
    if (!testimonial) return { ok: false, error: 'Témoignage introuvable.' }
    await prisma.testimonial.update({ where: { id }, data: { approved: !testimonial.approved } })
  } catch (e) {
    console.error('toggleTestimonialApproved:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function deleteTestimonial(id: number): Promise<TestimonialActionResult> {
  try {
    await prisma.testimonial.delete({ where: { id } })
  } catch (e) {
    console.error('deleteTestimonial:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}
