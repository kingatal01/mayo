import SettingsManager from '@/components/admin/SettingsManager'
import { getSiteSettings } from '@/lib/settings'

export default async function AdminSettings() {
  const settings = await getSiteSettings()
  return <SettingsManager settings={settings} />
}
