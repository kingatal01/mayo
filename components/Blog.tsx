import Link from 'next/link'
import { prisma } from '@/lib/prisma'

function formatDate(d: Date | null) {
  if (!d) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(d),
  )
}

export default async function Blog() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 3,
  })

  if (posts.length === 0) return null

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[#1D6FA4] font-semibold uppercase tracking-widest text-sm">Notre Blog</span>
          <h2 className="section-title mt-2">Dernières Actualités</h2>
          <p className="section-subtitle">
            Restez informé des dernières actualités médicales, conseils santé et recommandations bien-être de nos experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
              {/* Image placeholder */}
              <div className={`bg-gradient-to-br ${post.color} h-52 flex items-center justify-center`}>
                <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                  <span className="bg-blue-50 text-[#1D6FA4] px-3 py-1 rounded-full font-medium">{post.category}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-[#1D6FA4] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-[#1D6FA4] font-semibold text-sm hover:underline flex items-center gap-1">
                  Lire la suite
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
