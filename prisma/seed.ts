import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuário paciente
  await prisma.user.create({
    data: {
      email: "paciente@teste.com",
      name: "Paciente Teste",
      role: Role.PATIENT,
    },
  });

  // Usuário profissional
  await prisma.user.create({
    data: {
      email: "profissional@teste.com",
      name: "Dr. Ginecologista",
      role: Role.PROFESSIONAL,
      professionalProfile: {
        create: {
          crm: "12345",
          bio: "Especialista em saúde da mulher",
          specialty: "GYNECOLOGIST",
        },
      },
    },
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
}

main()
  .then(() => console.log("✅ Seed concluído"))
  .catch(e => console.error("❌ Erro no seed:", e))
  .finally(async () => await prisma.$disconnect());
