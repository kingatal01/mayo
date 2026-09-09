import { PrismaClient } from './generated/prisma/client'
import { createMariaDbAdapter } from './mariadb'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createMariaDbAdapter(),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
