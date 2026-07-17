'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { SITE_SETTING_KEYS } from '@/lib/settings'

export type SettingsResult = { ok: true } | { ok: false; error: string }

export async function updateSiteSettings(values: Record<string, string>): Promise<SettingsResult> {
  const keys = SITE_SETTING_KEYS.filter((k) => k in values)
  try {
    await prisma.$transaction(
      keys.map((key) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: values[key] ?? '' },
          create: { key, value: values[key] ?? '' },
        }),
      ),
    )
  } catch (e) {
    console.error('updateSiteSettings:', e)
    return { ok: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }
  revalidatePath('/', 'layout')
  revalidatePath('/admin', 'layout')
  return { ok: true }
}
