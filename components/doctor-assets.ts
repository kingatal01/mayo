// Palette de dégradés des avatars médecins.
// Les chaînes de classes Tailwind stockées en BD doivent vivre dans un fichier
// scanné par tailwind.config.ts : elles sont toutes listées ici.

export const doctorColorPalette = [
  { label: 'Bleu', value: 'from-blue-400 to-blue-600' },
  { label: 'Violet', value: 'from-purple-400 to-purple-600' },
  { label: 'Turquoise', value: 'from-teal-400 to-teal-600' },
  { label: 'Rose', value: 'from-pink-400 to-pink-600' },
  { label: 'Vert', value: 'from-green-400 to-green-600' },
  { label: 'Orange', value: 'from-orange-400 to-orange-600' },
  { label: 'Rouge', value: 'from-red-400 to-red-600' },
  { label: 'Indigo', value: 'from-indigo-400 to-indigo-600' },
  { label: 'Cyan', value: 'from-cyan-400 to-cyan-600' },
  { label: 'Ambre', value: 'from-amber-400 to-amber-600' },
  { label: 'Émeraude', value: 'from-emerald-400 to-emerald-600' },
  { label: 'Gris ardoise', value: 'from-slate-400 to-slate-600' },
]

export const doctorSocialIcons = [
  { key: 'facebook' as const, label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { key: 'twitter' as const, label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { key: 'linkedin' as const, label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
]
