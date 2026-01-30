const { defineConfig } = require("@prisma/config");
require("dotenv").config();

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    adapter: "postgresql",
    url: process.env.DATABASE_URL,
  },
});
