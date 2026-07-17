'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type SpecialtyInput = {
  title: string
  description: string
  icon: string | null
  color: string
  active: boolean
}

export type SpecialtyActionResult = { ok: true } | { ok: false; error: string }

const MAX_ICON_SIZE = 100 * 1024 // 100 Ko
const FORBIDDEN_SVG = /<script|<foreignObject|<iframe|javascript:|\son\w+\s*=/i

function validate(data: SpecialtyInput): string | null {
  if (!data.title.trim()) return 'Le titre est obligatoire.'
  if (!data.description.trim()) return 'La description est obligatoire.'
  if (data.icon != null) {
    const icon = data.icon.trim()
    if (!icon.startsWith('<svg') || !icon.endsWith('</svg>')) {
      return 'Le fichier doit être un SVG valide (balise <svg>).'
    }
    if (icon.length > MAX_ICON_SIZE) return 'Le fichier SVG dépasse 100 Ko.'
    if (FORBIDDEN_SVG.test(icon)) return 'Le SVG contient du contenu non autorisé (script, événements...).'
  }
  return null
}

function revalidate() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

export async function createSpecialty(data: SpecialtyInput): Promise<SpecialtyActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    const max = await prisma.specialty.aggregate({ _max: { order: true } })
    await prisma.specialty.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        icon: data.icon?.trim() || null,
        color: data.color,
        active: data.active,
        order: (max._max.order ?? -1) + 1,
      },
    })
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'P2002') {
      return { ok: false, error: 'Une spécialité avec ce titre existe déjà.' }
    }
    console.error('createSpecialty:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function updateSpecialty(id: number, data: SpecialtyInput): Promise<SpecialtyActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    await prisma.specialty.update({
      where: { id },
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        icon: data.icon?.trim() || null,
        color: data.color,
        active: data.active,
      },
    })
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'P2002') {
      return { ok: false, error: 'Une spécialité avec ce titre existe déjà.' }
    }
    console.error('updateSpecialty:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function toggleSpecialtyActive(id: number): Promise<SpecialtyActionResult> {
  try {
    const specialty = await prisma.specialty.findUnique({ where: { id } })
    if (!specialty) return { ok: false, error: 'Spécialité introuvable.' }
    await prisma.specialty.update({ where: { id }, data: { active: !specialty.active } })
  } catch (e) {
    console.error('toggleSpecialtyActive:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function deleteSpecialty(id: number): Promise<SpecialtyActionResult> {
  try {
    await prisma.specialty.delete({ where: { id } })
  } catch (e) {
    console.error('deleteSpecialty:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}
