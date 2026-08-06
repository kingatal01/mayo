// Constantes d'authentification importables partout, y compris le middleware
// (edge runtime). Ne rien importer ici qui dépende de Node/Prisma/bcrypt.

export const SESSION_COOKIE = 'mk_admin'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours (secondes)
