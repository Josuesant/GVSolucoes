# GV Soluções - Sistema de Gestão Financeira

Sistema web de gestão financeira para empresas que prestam serviços a condomínios, desenvolvido com React + Vite, Tailwind CSS e Supabase.

## 🎯 Funcionalidades

- **Dashboard**: Resumo financeiro com receitas, despesas, saldo e lembretes
- **Gerenciamento de Condomínios**: Cadastro de clientes com contratos de receita fixa
- **Gerenciamento de Funcionários**: Controle de folha de pagamento (salários e benefícios)
- **Transações**: Registro de receitas e despesas com categorização
- **Lembretes de Renovação**: Alertas automáticos para renovação de contratos
- **Tema Claro/Escuro**: Interface adaptável com preferências salvas

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta Supabase (gratuita em https://supabase.com)
- npm ou yarn

## 🚀 Instalação

### 1. Clonar/Preparar o Repositório
```bash
cd GVSolucoes
npm install
```

### 2. Configurar Supabase

1. Acesse https://supabase.com e crie um novo projeto
2. Configure as tabelas executando o SQL fornecido em `schema.sql`:

```sql
-- Extensão para UUIDs
create extension if not exists "pgcrypto";

-- Tabela: condominios
create table condominios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text not null unique,
  endereco text,
  data_inicio_contrato date not null,
  valor_contrato numeric(12,2) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tabela: funcionarios
create table funcionarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text not null unique,
  telefone text,
  salario_bruto numeric(12,2) not null,
  salario_liquido numeric(12,2) not null,
  beneficios numeric(12,2) default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Enums
create type tipo_transacao as enum ('receita', 'despesa');
create type categoria_transacao as enum (
  'Contrato', 'Serviço Extra', 'Imposto', 'Material de Limpeza', 'Salário', 'Benefício'
);

-- Tabela: transacoes
create table transacoes (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric(12,2) not null,
  tipo tipo_transacao not null,
  categoria categoria_transacao not null,
  data_lancamento date not null default current_date,
  condominio_id uuid references condominios(id) on delete set null,
  funcionario_id uuid references funcionarios(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Tabela: lembretes
create table lembretes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references condominios(id) on delete cascade,
  tipo text not null default 'renovacao_contrato',
  mensagem text not null,
  data_referencia date not null,
  resolvido boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security
ALTER TABLE condominios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lembretes ENABLE ROW LEVEL SECURITY;

-- Policies (para usuário único)
CREATE POLICY "Enable read access for authenticated users"
  ON condominios FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
  ON condominios FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
  ON condominios FOR UPDATE USING (auth.role() = 'authenticated');

-- Aplicar mesmas policies às outras tabelas...
```

3. Copie suas credenciais do Supabase:
   - URL da API (Project URL)
   - Chave pública (anon key)

### 3. Criar arquivo de configuração

Crie `src/lib/supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SEU_URL_AQUI'
const supabaseKey = 'SUA_CHAVE_PUBLICA_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 4. Rodar o Projeto

```bash
npm run dev
```

O sistema abrirá automaticamente em `http://localhost:5173`

## 🎨 Tema Claro/Escuro

- Clique no ícone de lua/sol no header para alternar temas
- Preferência é salva no localStorage
- Interface totalmente responsiva

## 📱 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas principais
│   ├── Dashboard.jsx
│   ├── Condominios.jsx
│   ├── Funcionarios.jsx
│   ├── Transacoes.jsx
│   └── Lembretes.jsx
├── lib/              # Utilitários e configurações
├── hooks/            # React hooks customizados
├── App.jsx           # Componente raiz
├── main.jsx          # Entrada da aplicação
└── index.css         # Estilos Tailwind
```

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitada
- Dados isolados por usuário

## 🚀 Próximas Fases

- **Fase 2**: Integração completa com Supabase (CRUD real)
- **Fase 3**: Job de lembretes automáticos com pg_cron
- **Fase 4**: Relatórios exportáveis (PDF/Excel)

## 📝 Licença

Desenvolvido especialmente para GV Soluções

## 💬 Suporte

Para dúvidas ou sugestões sobre este sistema, entre em contato.
