'use client'

import { useState } from 'react'

// Champ d'upload d'image avec aperçu. La valeur est soit un chemin existant
// (/uploads/...), soit une data URL (nouvel upload) transmise telle quelle à
// l'action serveur qui se charge de la sauvegarde.
export default function ImageUpload({
  value,
  onChange,
  aspect = 'aspect-video',
}: {
  value: string
  onChange: (value: string) => void
  aspect?: string
}) {
  const [error, setError] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type)) {
      setError('Choisissez une image PNG, JPG, WebP ou SVG.')
      e.target.value = ''
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('L\'image dépasse 3 Mo.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setError(null)
      onChange(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`w-28 ${aspect} rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center`}>
        {value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#1D6FA4] file:text-sm file:font-semibold hover:file:bg-blue-100 file:cursor-pointer"
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP ou SVG · max 3 Mo</p>
      </div>
    </div>
  )
}
