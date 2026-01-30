import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "paciente@example.com",
      name: "Maria Silva",
      role: "PATIENT",
    },
  });
}

main()
  .then(() => console.log("✅ Seed concluído!"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
