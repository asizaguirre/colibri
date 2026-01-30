// prisma.config.ts
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts", // se você tiver um seed.ts
  },
  datasource: {
    adapter: "postgresql",          // ✅ tipo de banco
    url: process.env.DATABASE_URL!, // ✅ string completa do .env
  },
});
