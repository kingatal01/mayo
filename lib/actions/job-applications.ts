'use server'

import { revalidatePath } from 'next/cache'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import type { ApplicationStatus } from '@/lib/generated/prisma/enums'

export type ApplyResult = { ok: true } | { ok: false; error: string }

const MAX_CV_SIZE = 4 * 1024 * 1024 // 4 Mo
// Stocké HORS du dossier public (données personnelles), servi via une route protégée.
const CV_DIR = path.join(process.cwd(), 'private_uploads', 'cv')
const CV_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

async function saveCv(file: File): Promise<{ path: string } | { error: string }> {
  const ext = CV_EXT[file.type]
  if (!ext) return { error: 'CV : formats acceptés PDF, DOC ou DOCX.' }
  if (file.size > MAX_CV_SIZE) return { error: 'Le CV dépasse 4 Mo.' }

  await fs.mkdir(CV_DIR, { recursive: true })
  const filename = `cv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(CV_DIR, filename), buffer)
  return { path: filename }
}

export async function submitApplication(formData: FormData): Promise<ApplyResult> {
  const offerId = Number(formData.get('offerId'))
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const phone = String(formData.get('phone') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const cv = formData.get('cv')

  if (!offerId || !name || !email) {
    return { ok: false, error: 'Veuillez remplir les champs obligatoires.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Adresse email invalide.' }
  }

  const offer = await prisma.jobOffer.findUnique({ where: { id: offerId } })
  if (!offer || !offer.published) {
    return { ok: false, error: "Cette offre n'est plus disponible." }
  }

  let cvPath: string | null = null
  if (cv instanceof File && cv.size > 0) {
    const saved = await saveCv(cv)
    if ('error' in saved) return { ok: false, error: saved.error }
    cvPath = saved.path
  }

  try {
    await prisma.jobApplication.create({
      data: {
        offerId,
        name,
        email,
        phone: phone || null,
        message: message || null,
        cvPath,
      },
    })
  } catch (e) {
    console.error('submitApplication:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus) {
  await prisma.jobApplication.update({ where: { id }, data: { status } })
  revalidatePath('/admin', 'layout')
}

export async function deleteApplication(id: number) {
  const deleted = await prisma.jobApplication.delete({ where: { id } })
  if (deleted.cvPath) {
    try {
      await fs.unlink(path.join(CV_DIR, deleted.cvPath))
    } catch {
      // fichier déjà absent
    }
  }
  revalidatePath('/admin', 'layout')
}
