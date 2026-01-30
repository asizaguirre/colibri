'use server';

import { z } from 'zod';
import prisma from './lib/prisma';
import { revalidatePath } from 'next/cache';
import { Specialty } from './generated/prisma';

// -----------------------------------------------------------------------------
// Schemas de Validação (Zod)
// -----------------------------------------------------------------------------

const AppointmentSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  category: z.enum(["Ginecologista", "Especialista"], {
    errorMap: () => ({ message: "Selecione uma categoria válida" }),
  }),
});

// -----------------------------------------------------------------------------
// Server Actions
// -----------------------------------------------------------------------------

/**
 * Cria um novo agendamento no banco de dados.
 * Valida nome, email e categoria, cria o usuário se necessário e agenda.
 */
export async function createAppointment(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    category: formData.get('category'),
  };

  const validated = AppointmentSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Dados inválidos", issues: validated.error.flatten().fieldErrors };
  }

  const { name, email, category } = validated.data;

  try {
    // 1. Busca ou Cria o Paciente (User)
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, role: 'PATIENT' },
      });
    }

    // 2. Mapeia Categoria para Specialty e busca Profissional
    const specialtyMap: Record<string, Specialty> = {
      'Ginecologista': 'GYNECOLOGIST',
      'Especialista': 'REPRODUCTION_SPECIALIST',
    };

    const professional = await prisma.professional.findFirst({
      where: { specialty: specialtyMap[category] },
    });

    if (!professional) {
      return { error: "Nenhum profissional disponível para esta especialidade." };
    }

    // 3. Cria o Agendamento (Data atual como padrão para "fila de espera")
    await prisma.appointment.create({
      data: {
        date: new Date(),
        status: 'PENDING',
        patientId: user.id,
        professionalId: professional.id,
        notes: `Solicitação via site. Categoria: ${category}`,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: "Agendamento solicitado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { error: "Erro interno ao processar sua solicitação." };
  }
}