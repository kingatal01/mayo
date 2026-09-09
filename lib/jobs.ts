import type { JobType, ApplicationStatus } from '@/lib/generated/prisma/enums'

// Clause Prisma : offres actuellement ouvertes (publiées et dans la période
// ouverture <= aujourd'hui <= clôture). Les dates nulles ne bornent pas.
export function openOffersWhere() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return {
    published: true,
    AND: [
      { OR: [{ openingDate: null }, { openingDate: { lte: now } }] },
      { OR: [{ closingDate: null }, { closingDate: { gte: startOfToday } }] },
    ],
  }
}

// Clause Prisma : offres à lister sur la page /recrutement — publiées et déjà
// ouvertes (openingDate passée ou nulle), qu'elles soient encore ouvertes ou
// closes. Les offres pas encore ouvertes restent masquées.
export function listedOffersWhere() {
  const now = new Date()
  return {
    published: true,
    OR: [{ openingDate: null }, { openingDate: { lte: now } }],
  }
}

// Vrai si une offre est actuellement ouverte aux candidatures.
export function isOfferOpen(offer: {
  published: boolean
  openingDate: Date | null
  closingDate: Date | null
}): boolean {
  if (!offer.published) return false
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (offer.openingDate && new Date(offer.openingDate) > now) return false
  if (offer.closingDate && new Date(offer.closingDate) < startOfToday) return false
  return true
}

export const jobTypeLabels: Record<JobType, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  STAGE: 'Stage',
  TEMPS_PARTIEL: 'Temps partiel',
  CONSULTANT: 'Consultant',
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  NEW: 'Nouvelle',
  REVIEWED: 'Examinée',
  SHORTLISTED: 'Présélectionnée',
  REJECTED: 'Rejetée',
}

export const applicationStatusStyles: Record<ApplicationStatus, string> = {
  NEW: 'bg-amber-50 text-amber-600',
  REVIEWED: 'bg-blue-50 text-[#1D6FA4]',
  SHORTLISTED: 'bg-green-50 text-green-600',
  REJECTED: 'bg-red-50 text-red-600',
}
