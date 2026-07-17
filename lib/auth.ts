// Configuration d'authentification admin (importable côté middleware et serveur).
// Définissez ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET dans .env en production.

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mayoklinic.td'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mayoklinic2026'

export const SESSION_COOKIE = 'mk_admin'
export const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET || 'mk-admin-session-v1'

export function checkCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD
}
