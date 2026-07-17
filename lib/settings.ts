import { prisma } from '@/lib/prisma'

export type SiteSettings = {
  phone: string
  email: string
  address: string
  latitude: string
  longitude: string
  hours: string
  emergency: string
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
}

const defaults: SiteSettings = {
  phone: '(235) 30031414 / 65173434',
  email: 'contact@mayoklinic.td',
  address: "Quartier Ardep-djoumal, 3ème Arrondissement — N'Djamena, Tchad",
  latitude: '12.0969048',
  longitude: '15.0590096',
  hours: 'Lun–Sam : 8h00 – 18h00',
  emergency: '24h/24 et 7j/7',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
}

export const SITE_SETTING_KEYS = Object.keys(defaults) as (keyof SiteSettings)[]

// Charge les paramètres du site (coordonnées, horaires, réseaux) depuis la BD.
export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany({ where: { key: { in: SITE_SETTING_KEYS } } })
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return { ...defaults, ...map } as SiteSettings
}

// Renvoie la liste des réseaux sociaux renseignés (pour l'affichage public).
export function socialLinks(settings: SiteSettings): { label: string; url: string }[] {
  return (
    [
      { label: 'Facebook', url: settings.facebook },
      { label: 'Twitter', url: settings.twitter },
      { label: 'Instagram', url: settings.instagram },
      { label: 'LinkedIn', url: settings.linkedin },
    ] as const
  )
    .filter((s) => s.url.trim())
    .map((s) => ({ label: s.label, url: s.url.trim() }))
}

// Convertit un numéro affiché en lien tel: (garde le premier numéro).
export function telHref(phone: string): string {
  const first = phone.split('/')[0]
  const digits = first.replace(/[^0-9+]/g, '')
  return `tel:${digits.startsWith('+') ? digits : '+235' + digits.replace(/^0+/, '')}`
}
