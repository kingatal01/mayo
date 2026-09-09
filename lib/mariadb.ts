import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Construit l'adaptateur MariaDB/MySQL à partir de DATABASE_URL.
//
// Par défaut on passe la chaîne de connexion telle quelle à l'adaptateur
// (comportement d'origine, éprouvé en production).
//
// Uniquement si DB_ALLOW_PUBLIC_KEY=1 (à mettre dans le .env LOCAL), on passe
// par un objet de config avec allowPublicKeyRetrieval — nécessaire pour
// l'authentification caching_sha2_password d'un MySQL 8 en développement.
// La production n'active pas ce flag : son chemin reste strictement identique.
export function createMariaDbAdapter(): PrismaMariaDb {
  const connectionString = process.env.DATABASE_URL as string

  if (process.env.DB_ALLOW_PUBLIC_KEY !== '1') {
    return new PrismaMariaDb(connectionString)
  }

  const url = new URL(connectionString)
  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    allowPublicKeyRetrieval: true,
  })
}
