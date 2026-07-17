'use server'

import { revalidatePath } from 'next/cache'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export type DoctorInput = {
  name: string
  specialty: string
  initials: string
  // Chemin existant (/uploads/doctors/...), data URL pour un nouvel upload, ou null
  photo: string | null
  color: string
  facebook: string
  twitter: string
  linkedin: string
  active: boolean
}

const MAX_PHOTO_SIZE = 2 * 1024 * 1024 // 2 Mo
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'uploads', 'doctors')

async function savePhoto(dataUrl: string): Promise<{ path: string } | { error: string }> {
  const match = /^data:image\/(png|jpe?g|webp|svg\+xml);base64,(.+)$/.exec(dataUrl)
  if (!match) return { error: 'Format de photo non supporté (PNG, JPG, WebP ou SVG).' }
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1] === 'svg+xml' ? 'svg' : match[1]
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > MAX_PHOTO_SIZE) return { error: 'La photo dépasse 2 Mo.' }

  await fs.mkdir(PHOTOS_DIR, { recursive: true })
  const filename = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await fs.writeFile(path.join(PHOTOS_DIR, filename), buffer)
  return { path: `/uploads/doctors/${filename}` }
}

async function deletePhotoFile(photoPath: string | null) {
  if (!photoPath?.startsWith('/uploads/doctors/')) return
  try {
    await fs.unlink(path.join(process.cwd(), 'public', photoPath))
  } catch {
    // fichier déjà absent : rien à faire
  }
}

// Résout le champ photo : sauvegarde le fichier si c'est un nouvel upload.
async function resolvePhoto(photo: string | null): Promise<{ value: string | null } | { error: string }> {
  if (photo?.startsWith('data:image/')) {
    const saved = await savePhoto(photo)
    if ('error' in saved) return { error: saved.error }
    return { value: saved.path }
  }
  return { value: photo }
}

export type DoctorActionResult = { ok: true } | { ok: false; error: string }

function validate(data: DoctorInput): string | null {
  if (!data.name.trim()) return 'Le nom est obligatoire.'
  if (!data.specialty.trim()) return 'La spécialité est obligatoire.'
  for (const [label, url] of [
    ['Facebook', data.facebook],
    ['Twitter / X', data.twitter],
    ['LinkedIn', data.linkedin],
  ] as const) {
    if (url.trim() && !/^https?:\/\//i.test(url.trim())) {
      return `Le lien ${label} doit commencer par http:// ou https://`
    }
  }
  return null
}

function toInitials(name: string) {
  return name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function toData(data: DoctorInput, photo: string | null) {
  return {
    name: data.name.trim(),
    specialty: data.specialty.trim(),
    initials: data.initials.trim().toUpperCase() || toInitials(data.name),
    photo,
    color: data.color,
    facebook: data.facebook.trim() || null,
    twitter: data.twitter.trim() || null,
    linkedin: data.linkedin.trim() || null,
    active: data.active,
  }
}

function revalidate() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

export async function createDoctor(data: DoctorInput): Promise<DoctorActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  const photo = await resolvePhoto(data.photo)
  if ('error' in photo) return { ok: false, error: photo.error }

  try {
    const max = await prisma.doctor.aggregate({ _max: { order: true } })
    await prisma.doctor.create({ data: { ...toData(data, photo.value), order: (max._max.order ?? -1) + 1 } })
  } catch (e) {
    console.error('createDoctor:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function updateDoctor(id: number, data: DoctorInput): Promise<DoctorActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  const photo = await resolvePhoto(data.photo)
  if ('error' in photo) return { ok: false, error: photo.error }

  try {
    const existing = await prisma.doctor.findUnique({ where: { id } })
    if (!existing) return { ok: false, error: 'Médecin introuvable.' }
    await prisma.doctor.update({ where: { id }, data: toData(data, photo.value) })
    if (existing.photo && existing.photo !== photo.value) await deletePhotoFile(existing.photo)
  } catch (e) {
    console.error('updateDoctor:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function toggleDoctorActive(id: number): Promise<DoctorActionResult> {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id } })
    if (!doctor) return { ok: false, error: 'Médecin introuvable.' }
    await prisma.doctor.update({ where: { id }, data: { active: !doctor.active } })
  } catch (e) {
    console.error('toggleDoctorActive:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function deleteDoctor(id: number): Promise<DoctorActionResult> {
  try {
    const deleted = await prisma.doctor.delete({ where: { id } })
    await deletePhotoFile(deleted.photo)
  } catch (e) {
    console.error('deleteDoctor:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}
