import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../lib/generated/prisma/client'
import { createMariaDbAdapter } from '../lib/mariadb'

// Réinitialise (ou crée) le compte administrateur à partir des variables
// ADMIN_EMAIL / ADMIN_PASSWORD du fichier .env. À lancer via `yarn db:reset-admin`.
const prisma = new PrismaClient({ adapter: createMariaDbAdapter() })

async function main() {
  const email = 'admin@mayoklinic.td'.toLowerCase()
  const password =  'mayoklinic2026'
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', active: true },
    create: { name: 'Administrateur', email, passwordHash, role: 'ADMIN' },
  })

  // Invalide les sessions existantes de ce compte (force une reconnexion).
  await prisma.session.deleteMany({ where: { userId: user.id } })

  console.log(`✔ Compte admin réinitialisé : ${email}`)
  console.log('  Toutes les sessions de ce compte ont été invalidées.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
