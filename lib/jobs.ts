import type { JobType, ApplicationStatus } from '@/lib/generated/prisma/enums'

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
