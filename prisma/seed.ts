import 'dotenv/config';
import { PrismaClient, Role, Specialty, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuário paciente
  const paciente = await prisma.user.create({
    data: {
      email: "paciente@teste.com",
      name: "Paciente Teste",
      role: Role.PATIENT,
    },
  });

  // Usuário profissional com perfil
  const profissional = await prisma.user.create({
    data: {
      email: "profissional@teste.com",
      name: "Dr. Ginecologista",
      role: Role.PROFESSIONAL,
      professionalProfile: {
        create: {
          crm: "12345",
          bio: "Especialista em saúde da mulher",
          specialty: Specialty.GYNECOLOGIST, // ✅ enum correto
        },
      },
    },
    include: { professionalProfile: true },
  });

  // Insumo
  await prisma.supply.create({
    data: {
      name: "Luvas descartáveis",
      description: "Luvas de procedimento",
      quantity: 100,
      unit: "caixa",
      minQuantity: 10,
    },
  });

  // Consulta de exemplo
  await prisma.appointment.create({
    data: {
      date: new Date(),
      status: AppointmentStatus.CONFIRMED,
      notes: "Primeira consulta de rotina",
      patientId: paciente.id,
      professionalId: profissional.professionalProfile!.id,
    },
  });
}

main()
  .then(() => console.log("✅ Seed concluído"))
  .catch(e => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
