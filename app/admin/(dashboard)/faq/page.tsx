import FaqsManager from '@/components/admin/FaqsManager'
import { prisma } from '@/lib/prisma'

export default async function AdminFAQ() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, question: true, answer: true, active: true },
  })

  return <FaqsManager faqs={faqs} />
}
