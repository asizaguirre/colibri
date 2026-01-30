#!/bin/bash

# Script de Deploy para Vercel
# Trata o erro "PrismaConfigEnvError" injetando uma DATABASE_URL temporária se ela não existir.
# Isso permite que o 'prisma generate' (postinstall) rode localmente sem precisar do .env real.

export DATABASE_URL=${DATABASE_URL:-"postgresql://build:build@localhost:5432/build_db"}

echo "🧹 Limpando arquivos conflitantes..."
rm -f "pages/[id].ts" "pages/[id].js"

echo "📦 Instalando dependências..."
npm install

echo "🔄 Gerando Prisma Client (Garantia de estabilidade)..."
# Garante que o cliente esteja sincronizado com o schema atual
npx prisma generate

echo "📝 Adicionando arquivos ao Git..."
git add .

echo "🔒 Criando commit de produção..."
git commit -m "Deploy: Atualização automática para produção" || echo "⚠️ Nada a commitar, continuando..."

echo "🚀 Enviando para o GitHub..."
git push origin main

echo "✅ Deploy enviado com sucesso!"