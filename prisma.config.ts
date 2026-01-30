import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    adapter: {
      provider: "postgresql",
      url: process.env.DATABASE_URL!, // ✅ conexão direta
    },
    // Se quiser usar Accelerate (Data Proxy):
    // accelerateUrl: process.env.ACCELERATE_URL,
  },
});
