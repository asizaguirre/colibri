'use server';

import { z } from 'zod';
import prisma from './lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { Specialty } from '../generated/prisma';

// -----------------------------------------------------------------------------
// Schemas de Validação (Zod)
// -----------------------------------------------------------------------------

const AppointmentSchema = z.object({
  professionalId: z.coerce.number().min(1, "Selecione um profissional válido"),
  date: z.coerce.date().min(new Date(), "A data do agendamento deve ser futura"),
  notes: z.string().optional(),
});

const SupplyUpdateSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(0, "A quantidade não pode ser negativa"),
});

// -----------------------------------------------------------------------------
// Server Actions
// -----------------------------------------------------------------------------

/**
 * Cria um novo agendamento no banco de dados.
 * Equivalente a POST /appointment
 */
export async function createAppointment(formData: FormData) {
  // 1. Segurança: Verifica sessão
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: "Você precisa estar logado para agendar." };
  }

  // 2. Extração e Validação
  const rawData = {
    professionalId: formData.get('professionalId'),
    date: formData.get('date'),
    notes: formData.get('notes'),
  };

  const validated = AppointmentSchema.safeParse(rawData);

  if (!validated.success) {
    // Retorna erros formatados para o frontend
    return { error: "Dados inválidos", issues: validated.error.flatten().fieldErrors };
  }

  const { professionalId, date, notes } = validated.data;

  try {
    // 3. Persistência
    // @ts-expect-error - O ID foi injetado na sessão no passo anterior (auth.ts)
    const patientId = session.user.id;

    await prisma.appointment.create({
      data: {
        date,
        notes,
        status: 'PENDING',
        patientId: Number(patientId),
        professionalId: professionalId,
      },
    });

    // 4. Revalidação (Atualiza a UI sem refresh)
    revalidatePath('/dashboard');
    return { success: true, message: "Consulta agendada com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { error: "Erro interno ao processar agendamento." };
  }
}

/**
 * Busca profissionais, opcionalmente filtrando por especialidade.
 * Equivalente a GET /professionals
 */
export async function getProfessionals(specialty?: string) {
  try {
    const where = specialty ? { specialty: specialty as Specialty } : {};
    
    return await prisma.professional.findMany({
      where,
      include: {
        user: {
          select: { name: true, image: true }, // Traz apenas dados necessários
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    return [];
  }
}

/**
 * Atualiza a quantidade de um insumo.
 * Equivalente a PATCH /supplies
 */
export async function updateSupply(id: number, quantity: number) {
  const validated = SupplyUpdateSchema.safeParse({ id, quantity });

  if (!validated.success) {
    return { error: "Quantidade inválida." };
  }

  try {
    await prisma.supply.update({
      where: { id },
      data: { quantity },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar estoque:", error);
    return { error: "Falha ao atualizar estoque." };
  }
}