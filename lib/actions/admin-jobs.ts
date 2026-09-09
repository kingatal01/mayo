'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { JobType } from '@/lib/generated/prisma/enums'

export type JobInput = {
  title: string
  department: string
  location: string
  type: JobType
  description: string
  profile: string
  closingDate: string // yyyy-mm-dd ou ''
  published: boolean
}

export type JobActionResult = { ok: true } | { ok: false; error: string }

function validate(data: JobInput): string | null {
  if (!data.title.trim()) return 'Le titre est obligatoire.'
  if (!data.department.trim()) return 'Le département est obligatoire.'
  if (!data.description.trim()) return 'La description du poste est obligatoire.'
  return null
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

async function uniqueSlug(title: string, excludeId?: number) {
  const base = slugify(title) || 'offre'
  let slug = base
  let n = 1
  while (true) {
    const existing = await prisma.jobOffer.findUnique({ where: { slug } })
    if (!existing || existing.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

function toData(data: JobInput) {
  return {
    title: data.title.trim(),
    department: data.department.trim(),
    location: data.location.trim() || "N'Djamena, Tchad",
    type: data.type,
    description: data.description.trim(),
    profile: data.profile.trim(),
    closingDate: data.closingDate ? new Date(data.closingDate) : null,
    published: data.published,
  }
}

function revalidate(slug?: string) {
  revalidatePath('/recrutement')
  revalidatePath('/admin', 'layout')
  if (slug) revalidatePath(`/recrutement/${slug}`)
}

export async function createJobOffer(data: JobInput): Promise<JobActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    const slug = await uniqueSlug(data.title)
    const max = await prisma.jobOffer.aggregate({ _max: { order: true } })
    await prisma.jobOffer.create({
      data: {
        ...toData(data),
        slug,
        order: (max._max.order ?? -1) + 1,
        publishedAt: data.published ? new Date() : null,
      },
    })
  } catch (e) {
    console.error('createJobOffer:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }

  revalidate()
  return { ok: true }
}

export async function updateJobOffer(id: number, data: JobInput): Promise<JobActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    const existing = await prisma.jobOffer.findUnique({ where: { id } })
    if (!existing) return { ok: false, error: 'Offre introuvable.' }
    const slug = await uniqueSlug(data.title, id)
    await prisma.jobOffer.update({
      where: { id },
      data: {
        ...toData(data),
        slug,
        publishedAt: data.published ? existing.publishedAt ?? new Date() : null,
      },
    })
    revalidate(existing.slug)
    revalidate(slug)
  } catch (e) {
    console.error('updateJobOffer:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }

  return { ok: true }
}

export async function toggleJobPublished(id: number): Promise<JobActionResult> {
  try {
    const offer = await prisma.jobOffer.findUnique({ where: { id } })
    if (!offer) return { ok: false, error: 'Offre introuvable.' }
    const published = !offer.published
    await prisma.jobOffer.update({
      where: { id },
      data: { published, publishedAt: published ? offer.publishedAt ?? new Date() : null },
    })
    revalidate(offer.slug)
  } catch (e) {
    console.error('toggleJobPublished:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  return { ok: true }
}

export async function deleteJobOffer(id: number): Promise<JobActionResult> {
  try {
    const deleted = await prisma.jobOffer.delete({ where: { id } })
    revalidate(deleted.slug)
  } catch (e) {
    console.error('deleteJobOffer:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  return { ok: true }
}
