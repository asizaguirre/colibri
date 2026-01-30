"use server";

import { prisma } from "@/lib/prisma";

export async function scheduleAppointment(formData: FormData) {
  const professionalId = Number(formData.get("professionalId"));
  const date = new Date(formData.get("date") as string);
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

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
