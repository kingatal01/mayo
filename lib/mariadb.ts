import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Construit l'adaptateur MariaDB/MySQL à partir de DATABASE_URL.
// `allowPublicKeyRetrieval` permet l'authentification caching_sha2_password de
// MySQL 8 sur une connexion locale (dev). Inoffensif en production (localhost).
export function createMariaDbAdapter(): PrismaMariaDb {
  const url = new URL(process.env.DATABASE_URL as string)
  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    allowPublicKeyRetrieval: true,
    connectionLimit: 10,
  })
}
