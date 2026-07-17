'use server'

import { revalidatePath } from 'next/cache'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { StatSection } from '@/lib/generated/prisma/enums'

export type ActionResult = { ok: true } | { ok: false; error: string }

const MAX_IMAGE_SIZE = 3 * 1024 * 1024 // 3 Mo
const CONTENT_DIR = path.join(process.cwd(), 'public', 'uploads', 'content')

// Sauvegarde une image envoyée en data URL et renvoie son chemin public.
async function saveImage(dataUrl: string): Promise<{ path: string } | { error: string }> {
  const match = /^data:image\/(png|jpe?g|webp|svg\+xml);base64,(.+)$/.exec(dataUrl)
  if (!match) return { error: 'Format d\'image non supporté (PNG, JPG, WebP ou SVG).' }
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1] === 'svg+xml' ? 'svg' : match[1]
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > MAX_IMAGE_SIZE) return { error: 'L\'image dépasse 3 Mo.' }

  await fs.mkdir(CONTENT_DIR, { recursive: true })
  const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await fs.writeFile(path.join(CONTENT_DIR, filename), buffer)
  return { path: `/uploads/content/${filename}` }
}

async function deleteImageFile(imagePath: string | null | undefined) {
  if (!imagePath?.startsWith('/uploads/content/')) return
  try {
    await fs.unlink(path.join(process.cwd(), 'public', imagePath))
  } catch {
    // fichier déjà absent : rien à faire
  }
}

// Résout un champ image : sauvegarde le fichier si c'est un nouvel upload (data URL).
async function resolveImage(image: string): Promise<{ value: string } | { error: string }> {
  if (image.startsWith('data:image/')) {
    const saved = await saveImage(image)
    if ('error' in saved) return { error: saved.error }
    return { value: saved.path }
  }
  return { value: image }
}

function revalidate() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

/* ----------------------------- Hero slides ----------------------------- */

export type HeroSlideInput = {
  tag: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: string
  active: boolean
}

function validateSlide(data: HeroSlideInput): string | null {
  if (!data.title.trim()) return 'Le titre est obligatoire.'
  if (!data.description.trim()) return 'La description est obligatoire.'
  return null
}

function toSlideData(data: HeroSlideInput) {
  return {
    tag: data.tag.trim(),
    title: data.title.trim(),
    description: data.description.trim(),
    ctaLabel: data.ctaLabel.trim() || 'En savoir plus',
    ctaHref: data.ctaHref.trim() || '#about',
    image: data.image.trim() || '/image_face.jpeg',
    active: data.active,
  }
}

export async function createHeroSlide(data: HeroSlideInput): Promise<ActionResult> {
  const error = validateSlide(data)
  if (error) return { ok: false, error }

  const image = await resolveImage(data.image.trim() || '/image_face.jpeg')
  if ('error' in image) return { ok: false, error: image.error }

  try {
    const max = await prisma.heroSlide.aggregate({ _max: { order: true } })
    await prisma.heroSlide.create({
      data: { ...toSlideData(data), image: image.value, order: (max._max.order ?? -1) + 1 },
    })
  } catch (e) {
    console.error('createHeroSlide:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function updateHeroSlide(id: number, data: HeroSlideInput): Promise<ActionResult> {
  const error = validateSlide(data)
  if (error) return { ok: false, error }

  const image = await resolveImage(data.image.trim() || '/image_face.jpeg')
  if ('error' in image) return { ok: false, error: image.error }

  try {
    const existing = await prisma.heroSlide.findUnique({ where: { id } })
    if (!existing) return { ok: false, error: 'Slide introuvable.' }
    await prisma.heroSlide.update({ where: { id }, data: { ...toSlideData(data), image: image.value } })
    if (existing.image !== image.value) await deleteImageFile(existing.image)
  } catch (e) {
    console.error('updateHeroSlide:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function toggleHeroSlideActive(id: number): Promise<ActionResult> {
  try {
    const slide = await prisma.heroSlide.findUnique({ where: { id } })
    if (!slide) return { ok: false, error: 'Slide introuvable.' }
    await prisma.heroSlide.update({ where: { id }, data: { active: !slide.active } })
  } catch (e) {
    console.error('toggleHeroSlideActive:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function deleteHeroSlide(id: number): Promise<ActionResult> {
  try {
    const deleted = await prisma.heroSlide.delete({ where: { id } })
    await deleteImageFile(deleted.image)
  } catch (e) {
    console.error('deleteHeroSlide:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function moveHeroSlide(id: number, direction: 'up' | 'down'): Promise<ActionResult> {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } })
    const index = slides.findIndex((s) => s.id === id)
    if (index === -1) return { ok: false, error: 'Slide introuvable.' }
    const swap = direction === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= slides.length) return { ok: true }
    await prisma.$transaction([
      prisma.heroSlide.update({ where: { id: slides[index].id }, data: { order: slides[swap].order } }),
      prisma.heroSlide.update({ where: { id: slides[swap].id }, data: { order: slides[index].order } }),
    ])
  } catch (e) {
    console.error('moveHeroSlide:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

/* -------------------------------- Stats -------------------------------- */

export type StatInput = { section: StatSection; value: string; label: string }

export async function createStat(data: StatInput): Promise<ActionResult> {
  if (!data.value.trim() || !data.label.trim()) return { ok: false, error: 'Valeur et libellé obligatoires.' }
  try {
    const max = await prisma.stat.aggregate({ where: { section: data.section }, _max: { order: true } })
    await prisma.stat.create({
      data: {
        section: data.section,
        value: data.value.trim(),
        label: data.label.trim(),
        order: (max._max.order ?? -1) + 1,
      },
    })
  } catch (e) {
    console.error('createStat:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function updateStat(id: number, value: string, label: string): Promise<ActionResult> {
  if (!value.trim() || !label.trim()) return { ok: false, error: 'Valeur et libellé obligatoires.' }
  try {
    await prisma.stat.update({ where: { id }, data: { value: value.trim(), label: label.trim() } })
  } catch (e) {
    console.error('updateStat:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function deleteStat(id: number): Promise<ActionResult> {
  try {
    await prisma.stat.delete({ where: { id } })
  } catch (e) {
    console.error('deleteStat:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

export async function moveStat(id: number, direction: 'up' | 'down'): Promise<ActionResult> {
  try {
    const stat = await prisma.stat.findUnique({ where: { id } })
    if (!stat) return { ok: false, error: 'Statistique introuvable.' }
    const stats = await prisma.stat.findMany({ where: { section: stat.section }, orderBy: { order: 'asc' } })
    const index = stats.findIndex((s) => s.id === id)
    const swap = direction === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= stats.length) return { ok: true }
    await prisma.$transaction([
      prisma.stat.update({ where: { id: stats[index].id }, data: { order: stats[swap].order } }),
      prisma.stat.update({ where: { id: stats[swap].id }, data: { order: stats[index].order } }),
    ])
  } catch (e) {
    console.error('moveStat:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}

/* ------------------------------ À propos ------------------------------- */

export async function updateAboutSettings(values: Record<string, string>): Promise<ActionResult> {
  const allowed = [
    'about_title',
    'about_paragraph1',
    'about_paragraph2',
    'about_image',
    'about_badge1_value',
    'about_badge1_label',
    'about_badge2_value',
    'about_badge2_label',
  ]
  const next = { ...values }

  // L'image peut arriver en data URL (nouvel upload) : on la sauvegarde d'abord.
  if (typeof next.about_image === 'string' && next.about_image.startsWith('data:image/')) {
    const image = await resolveImage(next.about_image)
    if ('error' in image) return { ok: false, error: image.error }
    const previous = await prisma.setting.findUnique({ where: { key: 'about_image' } })
    next.about_image = image.value
    if (previous && previous.value !== image.value) await deleteImageFile(previous.value)
  }

  try {
    await prisma.$transaction(
      allowed
        .filter((key) => key in next)
        .map((key) =>
          prisma.setting.upsert({
            where: { key },
            update: { value: next[key] },
            create: { key, value: next[key] },
          }),
        ),
    )
  } catch (e) {
    console.error('updateAboutSettings:', e)
    return { ok: false, error: 'Une erreur est survenue.' }
  }
  revalidate()
  return { ok: true }
}
