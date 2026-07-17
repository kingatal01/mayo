import NewsletterManager from '@/components/admin/NewsletterManager'
import { prisma } from '@/lib/prisma'

export default async function AdminNewsletter() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, active: true, createdAt: true },
  })

  return <NewsletterManager subscribers={subscribers} />
}
