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