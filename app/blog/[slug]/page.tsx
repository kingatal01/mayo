import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, socialLinks } from '@/lib/settings'

function formatDate(d: Date | null) {
  if (!d) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(d),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return { title: 'Article introuvable — Mayo Klinic' }
  return {
    title: `${post.title} — Mayo Klinic`,
    description: post.excerpt,
  }
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })

  if (!post || !post.published) notFound()

  const [related, siteSettings, services] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true, id: { not: post.id } },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 3,
    }),
    getSiteSettings(),
    prisma.specialty.findMany({ where: { active: true }, orderBy: { order: 'asc' }, take: 8, select: { title: true } }),
  ])
  const socials = socialLinks(siteSettings)

  return (
    <main>
      <TopBar phone={siteSettings.phone} email={siteSettings.email} address={siteSettings.address} socials={socials} />
      <Navbar />

      {/* En-tête de l'article */}
      <header className={`bg-gradient-to-br ${post.color} py-20`}>
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* Corps de l'article */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">{post.excerpt}</p>
        {post.content ? (
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
        ) : (
          <p className="text-gray-400 italic">Le contenu détaillé de cet article sera bientôt disponible.</p>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/#blog" className="text-[#1D6FA4] font-semibold text-sm hover:underline inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour aux actualités
          </Link>
        </div>
      </article>

      {/* Articles liés */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-800 mb-8">À lire également</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className={`bg-gradient-to-br ${p.color} h-40`} />
                  <div className="p-6">
                    <span className="bg-blue-50 text-[#1D6FA4] px-3 py-1 rounded-full font-medium text-xs">
                      {p.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-800 mt-3 group-hover:text-[#1D6FA4] transition-colors leading-snug">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer settings={siteSettings} services={services.map((x) => x.title)} socials={socials} />
    </main>
  )
}
