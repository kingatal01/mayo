import BlogManager from '@/components/admin/BlogManager'
import { prisma } from '@/lib/prisma'

export default async function AdminBlog() {
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })

  return <BlogManager posts={posts} />
}
