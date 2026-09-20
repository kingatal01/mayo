import { prisma } from '@/lib/prisma'
import { SECTION_SETTING_KEYS, mergeSectionHeadings, type SectionHeadings } from '@/lib/section-headings'

// Charge les en-têtes de sections depuis la BD (valeurs par défaut si absentes).
// Volontairement séparé de `section-headings.ts`, importé côté client : garder
// l'accès Prisma ici évite de tirer le pilote MariaDB dans le bundle navigateur.
export async function getSectionHeadings(): Promise<SectionHeadings> {
  const rows = await prisma.setting.findMany({ where: { key: { in: SECTION_SETTING_KEYS } } })
  return mergeSectionHeadings(Object.fromEntries(rows.map((r) => [r.key, r.value])))
}
