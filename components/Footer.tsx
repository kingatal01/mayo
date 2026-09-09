import Image from 'next/image'
import { telHref, type SiteSettings } from '@/lib/settings'

const quickLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Urgences', href: '/urgences' },
  { label: 'Nos services', href: '/services' },
  { label: 'Entreprises', href: '/entreprises' },
  { label: 'EVASAN', href: '/evasan' },
  { label: 'Recrutement', href: '/recrutement' },
  { label: 'Infos pratiques', href: '/infos-pratiques' },
  { label: 'Contact', href: '/#contact' },
]

const socialPaths: Record<string, string> = {
  Facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  Twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  Instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z',
  LinkedIn: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
}

export default function Footer({
  settings,
  services,
  socials,
}: {
  settings: SiteSettings
  services: string[]
  socials: { label: string; url: string }[]
}) {
  return (
    <footer id="contact" className="bg-[#06172e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.jpeg"
                alt="Mayo Klinic"
                width={48}
                height={48}
                className="rounded-md object-contain bg-white p-0.5"
              />
              <div>
                <div className="text-xl font-bold text-white leading-tight">Mayo Klinic</div>
                <div className="text-blue-400 text-xs tracking-widest">N'DJAMENA, TCHAD</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Votre partenaire de confiance pour votre santé. Situés au Quartier Ardep-djoumal, 3ème Arrondissement de N'Djamena.
            </p>
            <p className="text-xs text-blue-300 mb-5 italic">
              À côté du Lycée Félix Eboué et de l'Agence Tchadienne de Presse.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1D6FA4] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={socialPaths[s.label]} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-[#1D6FA4] transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3 text-[#1D6FA4]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Nos Spécialités</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <a href="#service" className="text-sm hover:text-[#1D6FA4] transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3 text-[#1D6FA4]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Contactez-nous</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#1D6FA4] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{settings.address}</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-blue-300">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>À côté du Lycée Félix Eboué<br/>et de l'Agence Tchadienne de Presse</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#1D6FA4] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
                </svg>
                <a href={telHref(settings.phone)} className="hover:text-[#1D6FA4] transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#1D6FA4] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a href={`mailto:${settings.email}`} className="hover:text-[#1D6FA4] transition-colors">{settings.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#1D6FA4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{settings.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mayo Klinic, N'Djamena, Tchad. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
