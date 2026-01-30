# Colibri 2.0 - Rede de Acolhimento

Plataforma de saúde reprodutiva focada na jornada da infertilidade, conectando pacientes a uma rede de acolhimento (Ginecologistas e Especialistas) e gerenciamento inteligente de insumos.

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** NextAuth.js (Google Provider)
- **Validação:** Zod
- **Ícones:** Lucide React
- **Deploy:** Vercel

## 🏗️ Arquitetura

### Infraestrutura Cloud

```mermaid
graph TD
    %% Estilos
    classDef user fill:#f9f,stroke:#333,stroke-width:2px;
    classDef app fill:#0070f3,stroke:#fff,stroke-width:2px,color:#fff;
    classDef auth fill:#ea4335,stroke:#fff,stroke-width:2px,color:#fff;
    classDef db fill:#336791,stroke:#fff,stroke-width:2px,color:#fff;
    classDef orm fill:#1a202c,stroke:#fff,stroke-width:2px,color:#fff;

    User((Usuário)):::user
    
    subgraph Vercel_Ecosystem [Vercel Cloud]
        NextJS[Next.js 14 App Router]:::app
        API[Server Actions / API Routes]:::app
    end

    Google[Google Auth<br/>OAuth 2.0 Provider]:::auth
    Prisma[Prisma ORM]:::orm
    Postgres[(PostgreSQL)]:::db

    %% Fluxos
    User -->|HTTPS / Browser| NextJS
    NextJS -->|Autenticação| Google
    NextJS -->|Dados via Server Actions| API
    API -->|Query Builder| Prisma
    Prisma -->|TCP Connection| Postgres

    %% Legenda de retorno
    Google -.->|Token JWT| NextJS
    Postgres -.->|Dados JSON| Prisma
```

### Jornada do Paciente (Contexto)

```mermaid
sequenceDiagram
    autonumber
    participant P as Paciente (Casal)
    participant C as Plataforma Colibri
    participant G as Ginecologista
    participant E as Especialista (Reprodução)

    Note over P, G: Fase 1: Pré-Concepção
    P->>C: Acessa Dashboard e busca Ginecologista
    C->>P: Exibe lista de profissionais disponíveis
    P->>G: Realiza Consulta de Rotina
    G->>C: Registra histórico inicial

    Note over P, E: Fase 2: Concepção / Tratamento
    alt Necessidade Identificada
        G-->>P: Encaminhamento para Especialista
        P->>C: Busca Especialista em Reprodução
        P->>E: Inicia Tratamento de Fertilidade
        E->>C: Prescreve Medicamentos (Smart Insumos)
    end

    Note over P, C: Fase 3: Acompanhamento
    C->>P: Notifica sobre estoque de insumos
    P->>C: Atualiza status do tratamento
```

## 💻 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL (Local ou Docker)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/colibri-2.0.git
   cd colibri-2.0
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/colibri_db"
   GOOGLE_CLIENT_ID="seu_google_client_id"
   GOOGLE_CLIENT_SECRET="seu_google_client_secret"
   NEXTAUTH_SECRET="sua_chave_secreta"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Configure o Banco de Dados**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Inicie o Servidor de Desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000`.

## 🚀 Deploy

O projeto está configurado para deploy na Vercel.

1. Utilize o script de deploy facilitado:
   ```bash
   ./deploy.sh
   ```
   Ou faça o push para a branch `main`.

2. Configure as variáveis de ambiente no painel da Vercel.
