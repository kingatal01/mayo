'use client'

import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Urgences', href: '/urgences' },
  { label: 'Entreprises', href: '/entreprises' },
  { label: 'À propos', href: '/#about' },
  { label: 'Spécialités', href: '/#service' },
  { label: 'Médecins', href: '/#doctor' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Mayo Klinic"
            width={44}
            height={44}
            className="rounded-md object-contain"
          />
          <span className="text-xl font-bold text-[#0d2d6b] leading-tight">
            Mayo<br /><span className="text-[#1D6FA4] text-sm font-semibold tracking-widest">KLINIC</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-gray-600 font-medium hover:text-[#0d2d6b] transition-colors duration-200 text-sm uppercase tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a href="/#appointment" className="hidden md:block btn-primary text-sm">
          Prendre RDV
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-600 font-medium hover:text-[#0d2d6b] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="/#appointment" className="btn-primary text-center text-sm" onClick={() => setMenuOpen(false)}>
            Prendre RDV
          </a>
        </div>
      )}
    </nav>
  )
}
