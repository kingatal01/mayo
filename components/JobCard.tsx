import Link from 'next/link'
import { jobTypeLabels } from '@/lib/jobs'
import type { JobType } from '@/lib/generated/prisma/enums'

export type PublicJob = {
  id: number
  title: string
  slug: string
  department: string
  location: string
  type: JobType
  image: string | null
}

export default function JobCard({ job, closed = false }: { job: PublicJob; closed?: boolean }) {
  return (
    <Link
      href={`/recrutement/${job.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
    >
      {/* Visuel */}
      <div className="relative">
        {job.image ? (
          <div className="h-40 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={job.image} alt={job.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${closed ? 'grayscale opacity-70' : ''}`} />
          </div>
        ) : (
          <div className={`h-40 bg-gradient-to-br from-[#0d2d6b] to-[#1D6FA4] flex items-center justify-center ${closed ? 'grayscale opacity-80' : ''}`}>
            <svg className="w-14 h-14 text-white/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        )}
        {closed && (
          <span className="absolute top-3 right-3 bg-gray-800/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Clôturée
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-[#1D6FA4]/10 text-[#1D6FA4] px-2.5 py-1 rounded-full text-xs font-semibold">
            {jobTypeLabels[job.type]}
          </span>
          <span className="text-xs text-gray-400">{job.department}</span>
        </div>
        <h3 className="font-bold text-gray-800 leading-snug group-hover:text-[#1D6FA4] transition-colors">
          {job.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {job.location}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-[#1D6FA4] font-semibold text-sm">
          Voir l&apos;offre
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
