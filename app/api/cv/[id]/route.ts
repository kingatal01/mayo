import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

const CV_DIR = path.join(process.cwd(), 'private_uploads', 'cv')
const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

// Téléchargement d'un CV réservé aux administrateurs connectés.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return new NextResponse('Non autorisé', { status: 401 })

  const { id } = await params
  const application = await prisma.jobApplication.findUnique({
    where: { id: Number(id) },
    include: { offer: { select: { title: true } } },
  })
  if (!application?.cvPath) return new NextResponse('CV introuvable', { status: 404 })

  // Empêche toute traversée de chemin : on n'utilise que le nom de fichier.
  const safeName = path.basename(application.cvPath)
  const filePath = path.join(CV_DIR, safeName)

  let data: Buffer
  try {
    data = await fs.readFile(filePath)
  } catch {
    return new NextResponse('Fichier absent', { status: 404 })
  }

  const ext = safeName.split('.').pop() ?? 'pdf'
  const downloadName = `CV-${application.name.replace(/[^a-zA-Z0-9]+/g, '_')}.${ext}`

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${downloadName}"`,
    },
  })
}
