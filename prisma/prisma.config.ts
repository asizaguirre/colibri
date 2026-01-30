import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!, // ✅ aqui vai sua URL
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts", // ✅ aponta para seu seed
  },
});
