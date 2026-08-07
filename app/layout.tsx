import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mayo Klinic | N\'Djamena, Tchad',
  description: 'Mayo Klinic, votre clinique de confiance à N\'Djamena. Quartier Ardep-djoumal, 3ème Arrondissement. 25 spécialités médicales, médecins experts, urgences 24h/24.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
