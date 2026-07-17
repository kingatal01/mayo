'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { AppointmentStatus } from '@/lib/generated/prisma/enums'

export async function updateAppointmentStatus(id: number, status: AppointmentStatus) {
  await prisma.appointment.update({ where: { id }, data: { status } })
  revalidatePath('/admin', 'layout')
}

export async function deleteAppointment(id: number) {
  await prisma.appointment.delete({ where: { id } })
  revalidatePath('/admin', 'layout')
}
