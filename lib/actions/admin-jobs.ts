'use server'

import { revalidatePath } from 'next/cache'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import type { JobType } from '@/lib/generated/prisma/enums'

export type JobInput = {
  title: string
  department: string
  location: string
  type: JobType
  image: string | null // chemin existant, data URL (nouvel upload) ou null
  description: string
  missions: string // une tâche par ligne
  profile: string
  openingDate: string // yyyy-mm-dd ou ''
  closingDate: string // yyyy-mm-dd ou ''
  published: boolean
}

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const JOBS_DIR = path.join(process.cwd(), 'public', 'uploads', 'jobs')

async function saveImage(dataUrl: string): Promise<{ path: string } | { error: string }> {
  const match = /^data:image\/(png|jpe?g|webp);base64,(.+)$/.exec(dataUrl)
  if (!match) return { error: "Image de l'offre : formats PNG, JPG ou WebP." }
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1]
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > MAX_IMAGE_SIZE) return { error: "L'image dépasse 3 Mo." }
  await fs.mkdir(JOBS_DIR, { recursive: true })
  const filename = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await fs.writeFile(path.join(JOBS_DIR, filename), buffer)
  return { path: `/uploads/jobs/${filename}` }
}

async function deleteImageFile(imagePath: string | null | undefined) {
  if (!imagePath?.startsWith('/uploads/jobs/')) return
  try {
    await fs.unlink(path.join(process.cwd(), 'public', imagePath))
  } catch {
    // fichier déjà absent
  }
}

async function resolveImage(image: string | null): Promise<{ value: string | null } | { error: string }> {
  if (image?.startsWith('data:image/')) {
    const saved = await saveImage(image)
    if ('error' in saved) return { error: saved.error }
    return { value: saved.path }
  }
  return { value: image }
}

export type JobActionResult = { ok: true } | { ok: false; error: string }

function validate(data: JobInput): string | null {
  if (!data.title.trim()) return 'Le titre est obligatoire.'
  if (!data.department.trim()) return 'Le département est obligatoire.'
  if (!data.description.trim()) return 'La description du poste est obligatoire.'
  if (data.openingDate && data.closingDate && data.openingDate > data.closingDate) {
    return "La date de clôture doit être postérieure à la date d'ouverture."
  }
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
    missions: data.missions.trim() || null,
    profile: data.profile.trim(),
    openingDate: data.openingDate ? new Date(data.openingDate) : null,
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

  const image = await resolveImage(data.image)
  if ('error' in image) return { ok: false, error: image.error }

  try {
    const slug = await uniqueSlug(data.title)
    const max = await prisma.jobOffer.aggregate({ _max: { order: true } })
    await prisma.jobOffer.create({
      data: {
        ...toData(data),
        image: image.value,
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

  const image = await resolveImage(data.image)
  if ('error' in image) return { ok: false, error: image.error }

  try {
    const existing = await prisma.jobOffer.findUnique({ where: { id } })
    if (!existing) return { ok: false, error: 'Offre introuvable.' }
    const slug = await uniqueSlug(data.title, id)
    await prisma.jobOffer.update({
      where: { id },
      data: {
        ...toData(data),
        image: image.value,
        slug,
        publishedAt: data.published ? existing.publishedAt ?? new Date() : null,
      },
    })
    if (existing.image && existing.image !== image.value) await deleteImageFile(existing.image)
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
    await deleteImageFile(deleted.image)
    revalidate(deleted.slug)
  } catch (e) {
    console.error('deleteJobOffer:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  return { ok: true }
}
