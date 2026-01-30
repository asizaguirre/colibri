const { defineConfig } = require("@prisma/config");
require("dotenv").config();

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    adapter: "postgresql",          // ✅ tipo de banco
    url: process.env.DATABASE_URL,  // ✅ string completa do .env
  },
});
