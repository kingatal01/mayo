import TestimonialsManager from '@/components/admin/TestimonialsManager'
import { prisma } from '@/lib/prisma'

export default async function AdminTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      role: true,
      text: true,
      initials: true,
      color: true,
      rating: true,
      approved: true,
    },
  })

  return <TestimonialsManager testimonials={testimonials} />
}
