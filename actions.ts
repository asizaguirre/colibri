"use server";

import { prisma } from "@/lib/prisma";

export async function scheduleAppointment(formData: FormData) {
  const professionalId = Number(formData.get("professionalId"));
  const dateString = formData.get("date") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!professionalId || isNaN(professionalId) || !dateString || !name || !email) {
    return { success: false, error: "Dados inválidos ou incompletos." };
  }

  const date = new Date(dateString);

  let patient = await prisma.user.findUnique({
    where: { email },
  });

  if (!patient) {
    patient = await prisma.user.create({
      data: { email, name },
    });
  }

  await prisma.appointment.create({
    data: {
      professionalId,
      patientId: patient.id,
      date,
      status: "PENDING",
    },
  });

  return { success: true };
}
