'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type BlogInput = {
  title: string
  category: string
  excerpt: string
  content: string
  color: string
  readTime: string
  published: boolean
}

export type BlogActionResult = { ok: true } | { ok: false; error: string }

function validate(data: BlogInput): string | null {
  if (!data.title.trim()) return 'Le titre est obligatoire.'
  if (!data.category.trim()) return 'La catégorie est obligatoire.'
  if (!data.excerpt.trim()) return "L'extrait est obligatoire."
  return null
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // supprime les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// Génère un slug unique (ajoute -2, -3... en cas de collision).
async function uniqueSlug(title: string, excludeId?: number) {
  const base = slugify(title) || 'article'
  let slug = base
  let n = 1
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (!existing || existing.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

function revalidate(slug?: string) {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function createBlogPost(data: BlogInput): Promise<BlogActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    const slug = await uniqueSlug(data.title)
    await prisma.blogPost.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content.trim() || null,
        color: data.color,
        readTime: data.readTime.trim() || '5 min de lecture',
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    })
  } catch (e) {
    console.error('createBlogPost:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  revalidate()
  return { ok: true }
}

export async function updateBlogPost(id: number, data: BlogInput): Promise<BlogActionResult> {
  const error = validate(data)
  if (error) return { ok: false, error }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return { ok: false, error: 'Article introuvable.' }
    const slug = await uniqueSlug(data.title, id)
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        category: data.category.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content.trim() || null,
        color: data.color,
        readTime: data.readTime.trim() || '5 min de lecture',
        published: data.published,
        // Fixe la date de publication au premier passage en "publié"
        publishedAt: data.published ? existing.publishedAt ?? new Date() : null,
      },
    })
    revalidate(existing.slug)
    revalidate(slug)
  } catch (e) {
    console.error('updateBlogPost:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  return { ok: true }
}

export async function toggleBlogPublished(id: number): Promise<BlogActionResult> {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return { ok: false, error: 'Article introuvable.' }
    const published = !post.published
    await prisma.blogPost.update({
      where: { id },
      data: { published, publishedAt: published ? post.publishedAt ?? new Date() : null },
    })
    revalidate(post.slug)
  } catch (e) {
    console.error('toggleBlogPublished:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  return { ok: true }
}

export async function deleteBlogPost(id: number): Promise<BlogActionResult> {
  try {
    const deleted = await prisma.blogPost.delete({ where: { id } })
    revalidate(deleted.slug)
  } catch (e) {
    console.error('deleteBlogPost:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }

  return { ok: true }
}
