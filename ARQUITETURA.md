# Arquitetura da Solução - Colibri 2.0

## Objetivo
Integrar a jornada de reprodução humana em uma plataforma única, conectando pacientes a uma rede de acolhimento especializada e oferecendo ferramentas de gestão inteligente.

## Tecnologias
- **Frontend/Backend:** Next.js 15+ (App Router)
- **ORM:** Prisma 7
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Vercel

## Fluxo da Jornada (POC)

```mermaid
graph TD
    subgraph "Interface (Next.js + Tailwind)"
        A[Dashboard Colibri 2.0] --> B[Rede de Acolhimento]
        A --> C[Smart Insumos]
        A --> D[Agenda Online]
    end

    subgraph "Infraestrutura (Vercel + Prisma)"
        B & D --> E[Prisma Client 7]
        E --> F[(PostgreSQL db.prisma.io)]
    end

    subgraph "Negócio (Life Clinic)"
        G[Ginecologista] -->|Pré-Concepção| A
        H[Especialista] -->|Concepção| A
    end
```