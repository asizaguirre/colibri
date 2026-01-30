"use server";

import { prisma } from "@/lib/prisma";

export async function scheduleAppointment(professionalId: number, patientId: number, date: Date, notes?: string) {
  return prisma.appointment.create({
    data: {
      professionalId,
      patientId,
      date,
      notes,
      status: "PENDING",
    },
  });
}
