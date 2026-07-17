'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type FaqInput = {
  question: string
  answer: string
  active: boolean
}

export type FaqActionResult = { ok: true } | { ok: false; error: string }

function validate(data: FaqInput): string | null {
  if (!data.question.trim()) return 'La question est obligatoire.'
  if (!data.answer.trim()) return 'La réponse est obligatoire.'
  return null
}

function revalidate() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

export async function createFaq(data: FaqInput): Promise<FaqActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    const max = await prisma.faq.aggregate({ _max: { order: true } })
    await prisma.faq.create({
      data: {
        question: data.question.trim(),
        answer: data.answer.trim(),
        active: data.active,
        order: (max._max.order ?? -1) + 1,
      },
    })
  } catch (e) {
    console.error('createFaq:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function updateFaq(id: number, data: FaqInput): Promise<FaqActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    await prisma.faq.update({
      where: { id },
      data: { question: data.question.trim(), answer: data.answer.trim(), active: data.active },
    })
  } catch (e) {
    console.error('updateFaq:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function toggleFaqActive(id: number): Promise<FaqActionResult> {
  try {
    const faq = await prisma.faq.findUnique({ where: { id } })
    if (!faq) return { ok: false, error: 'Question introuvable.' }
    await prisma.faq.update({ where: { id }, data: { active: !faq.active } })
  } catch (e) {
    console.error('toggleFaqActive:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function deleteFaq(id: number): Promise<FaqActionResult> {
  try {
    await prisma.faq.delete({ where: { id } })
  } catch (e) {
    console.error('deleteFaq:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

// Déplace une FAQ vers le haut (-1) ou le bas (+1) en échangeant l'ordre avec sa voisine.
export async function moveFaq(id: number, direction: 'up' | 'down'): Promise<FaqActionResult> {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } })
    const index = faqs.findIndex((f) => f.id === id)
    if (index === -1) return { ok: false, error: 'Question introuvable.' }

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= faqs.length) return { ok: true }

    const a = faqs[index]
    const b = faqs[swapIndex]
    await prisma.$transaction([
      prisma.faq.update({ where: { id: a.id }, data: { order: b.order } }),
      prisma.faq.update({ where: { id: b.id }, data: { order: a.order } }),
    ])
  } catch (e) {
    console.error('moveFaq:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}
