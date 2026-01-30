#!/bin/bash

# Script de Deploy para Vercel
# Trata o erro "PrismaConfigEnvError" injetando uma DATABASE_URL temporária se ela não existir.
# Isso permite que o 'prisma generate' (postinstall) rode localmente sem precisar do .env real.

export DATABASE_URL=${DATABASE_URL:-"postgresql://build:build@localhost:5432/build_db"}

echo "📦 Instalando dependências e gerando Prisma Client..."
# O npm install vai rodar o postinstall, que agora funcionará graças ao export acima
npm install

echo "Tb Adicionando arquivos ao Git..."
git add .

echo "VX Criando commit de produção..."
git commit -m "Deploy: Atualização automática para produção" || echo "⚠️ Nada a commitar, continuando..."

echo "🚀 Enviando para o GitHub..."
git push origin main

echo "✅ Deploy enviado com sucesso!"