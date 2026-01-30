'use server';

import { z } from 'zod';
import prisma from './lib/prisma';
import { revalidatePath } from 'next/cache';

// Schema validado para a jornada da Life Clinic
const AppointmentSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  category: z.enum(["Ginecologista", "Especialista"]),
});

export async function getDashboardData() {
  const [gynecologists, specialists, supplies, appointmentsCount] = await Promise.all([
    prisma.professional.findMany({
      where: { specialty: "Ginecologista" },
      include: { user: true },
    }),
    prisma.professional.findMany({
      where: { specialty: "Especialista" },
      include: { user: true },
    }),
    prisma.supply.findMany({
      orderBy: { quantity: 'asc' },
      take: 5
    }),
    prisma.appointment.count(),
  ]);

  return { gynecologists, specialists, supplies, appointmentsCount };
}

export async function createAppointment(formData: FormData) {
  const validatedFields = AppointmentSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    // 1. Trata a categoria como string para evitar conflitos de Enum
    const targetSpecialty = validatedFields.data.category as any;

    // 2. Busca um profissional disponível (regra simples: o primeiro encontrado)
    const professional = await prisma.professional.findFirst({
      where: { specialty: targetSpecialty }
    });

    if (!professional) {
      return { error: "Nenhum profissional disponível nesta categoria no momento." };
    }

    // 3. Cria o agendamento e o usuário (se não existir)
    await prisma.appointment.create({
      data: {
        date: new Date(), // Define data atual para "Fila de Espera"
        status: 'PENDING',
        notes: `Solicitação via Dashboard. Categoria: ${validatedFields.data.category}`,
        professional: { connect: { id: professional.id } },
        patient: {
          connectOrCreate: {
            where: { email: validatedFields.data.email },
            create: {
              email: validatedFields.data.email,
              name: validatedFields.data.name,
              role: 'PATIENT'
            },
          },
        },
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: "Solicitação enviada com sucesso!" };
  } catch (e) {
    console.error(e);
    return { error: "Erro ao conectar com o banco de dados." };
  }
}

// Novo Schema para o BookingModal
const BookingSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  professionalId: z.string().min(1, "Selecione um médico"),
  date: z.string().min(1, "Selecione uma data"),
});

export async function scheduleAppointment(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    professionalId: formData.get('professionalId'),
    date: formData.get('date'),
  };

  const validated = BookingSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.appointment.create({
      data: {
        date: new Date(validated.data.date),
        status: 'PENDING',
        notes: "Agendamento via BookingModal (Ciclo Completo)",
        professional: { connect: { id: Number(validated.data.professionalId) } },
        patient: {
          connectOrCreate: {
            where: { email: validated.data.email },
            create: {
              email: validated.data.email,
              name: validated.data.name,
              role: 'PATIENT'
            },
          },
        },
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Erro ao processar agendamento." };
  }
}