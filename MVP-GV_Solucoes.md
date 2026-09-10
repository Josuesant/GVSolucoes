1. Visão Geral do Projeto
Sistema web simples para gestão financeira de uma empresa que presta serviços a condomínios (provavelmente portaria, limpeza ou administração). O sistema controla receitas fixas (contratos de condomínios), despesas fixas (folha de funcionários), despesas variáveis (impostos, materiais) e receitas variáveis (serviços extras), além de alertar sobre renovações de contrato.

2. Stack Tecnológica
Frontend em React com Vite, estilizado com Tailwind CSS e componentes shadcn/ui (Card, Table, Dialog, Form, Badge, Tabs, Sonner/Toast, Calendar). Backend e banco de dados no Supabase (PostgreSQL + Auth + Edge Functions + pg_cron para o job agendado). Formulários com react-hook-form e validação com zod. Cliente de dados com @supabase/supabase-js.

Como é para um único usuário (seu amigo), a autenticação pode ser simples: Supabase Auth com e-mail/senha, uma única conta.

3. Modelo de Dados (Supabase)
Você pediu 4 tabelas principais. As três primeiras cobrem os cadastros e o fluxo de caixa; a quarta é necessária para suportar a regra de lembretes de renovação sem recalcular tudo toda vez e sem duplicar alertas — chamei de lembretes.

-- Extensão necessária para gerar UUIDs
create extension if not exists "pgcrypto";

-- Tabela: condominios (Fontes de Receita Fixa)
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

-- Tabela: funcionarios (Despesas Fixas com Pessoal)
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

-- Enums para o fluxo de caixa
create type tipo_transacao as enum ('receita', 'despesa');
create type categoria_transacao as enum (
  'Contrato', 'Serviço Extra', 'Imposto', 'Material de Limpeza', 'Salário', 'Benefício'
);

-- Tabela: transacoes (Fluxo de Caixa Real)
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

-- Tabela: lembretes (Alertas de Renovação de Contrato)
create table lembretes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references condominios(id) on delete cascade,
  tipo text not null default 'renovacao_contrato',
  mensagem text not null,
  data_referencia date not null,
  resolvido boolean not null default false,
  created_at timestamptz not null default now()
);

O campo funcionario_id em transacoes é opcional, mas útil: quando o salário ou benefício de um funcionário for lançado como despesa, ele fica rastreável até a origem.

Todas as tabelas devem ter Row Level Security (RLS) habilitada no Supabase, com política permitindo acesso apenas ao usuário autenticado (auth.uid() correspondente ao dono dos dados, ou simplesmente auth.role() = 'authenticated' já que é uso individual).

4. Regras de Negócio
Cadastro e inativação de condomínio. Ao inserir, valida-se CNPJ (formato) e obrigatoriedade de data de início e valor. A inativação não apaga o registro (soft delete via ativo = false), preservando o histórico de transações vinculadas.

Cadastro de funcionário. Ao cadastrar, o salário líquido e os benefícios podem gerar automaticamente lançamentos em transacoes como despesa (categoria "Salário" e "Benefício"), vinculados ao funcionario_id. Para o MVP, o mais simples é o usuário confirmar manualmente "lançar despesa deste mês" com um botão na tela do funcionário, evitando duplicação de lançamentos.

Impostos e materiais de limpeza. São lançamentos diretos em transacoes com tipo = 'despesa' e categoria correspondente ('Imposto' ou 'Material de Limpeza'), sem vínculo obrigatório a um condomínio (campo opcional).

Serviços extras. Lançamento direto em transacoes com tipo = 'receita' e categoria 'Serviço Extra', podendo ou não ser vinculado a um condominio_id.

Job mensal de verificação de aniversário de contrato. Todo início de mês, uma função verifica todos os condomínios ativos e identifica aqueles cujo mês de data_inicio_contrato coincide com o mês atual, calculando a próxima data de aniversário (ex.: contrato iniciado em 08/2023, hoje é 09/2026 → o aniversário de 3 anos foi em 08/2026, o próximo será 08/2027). Se ainda não existe um lembrete para aquela data de referência específica, o sistema insere um novo registro em lembretes.

5. Implementação do Job Mensal (Supabase Edge Function + pg_cron)

create or replace function public.gerar_lembretes_renovacao()
returns void
language plpgsql
as $$
declare
  proxima_data date;
begin
  insert into lembretes (condominio_id, mensagem, data_referencia)
  select
    c.id,
    'O contrato do condomínio "' || c.nome || '" completa ' ||
      (extract(year from age(current_date, c.data_inicio_contrato))::int + 1) ||
      ' ano(s) em breve. Avalie possível reajuste de valor.',
    c.data_inicio_contrato + make_interval(years => extract(year from age(current_date, c.data_inicio_contrato))::int + 1)
  from condominios c
  where c.ativo = true
    and extract(month from c.data_inicio_contrato) = extract(month from current_date)
    and not exists (
      select 1 from lembretes l
      where l.condominio_id = c.id
        and l.tipo = 'renovacao_contrato'
        and l.data_referencia = c.data_inicio_contrato
          + make_interval(years => extract(year from age(current_date, c.data_inicio_contrato))::int + 1)
    );
end;
$$;

-- Agenda: todo dia 1 de cada mês, às 06h
select cron.schedule(
  'lembretes-renovacao-mensal',
  '0 6 1 * *',
  $$select public.gerar_lembretes_renovacao();$$
);

Essa função pode ser executada tanto via pg_cron diretamente no Postgres do Supabase (extensão disponível nos projetos) quanto via uma Edge Function agendada, que chama essa mesma lógica. A checagem not exists evita que o mesmo aniversário gere lembretes duplicados caso o job rode mais de uma vez no mês.

6. Arquitetura do Frontend
Sugestão de estrutura de pastas:

src/
  components/
    ui/            -> componentes shadcn/ui (Button, Card, Dialog, Table, Form, etc.)
    condominios/   -> CondominioForm, CondominioTable, CondominioCard
    funcionarios/  -> FuncionarioForm, FuncionarioTable
    transacoes/    -> TransacaoForm, TransacaoTable, ResumoFluxoCaixa
    lembretes/     -> LembretesList, LembreteBadge
  lib/
    supabaseClient.ts
    validators.ts  -> schemas zod para cada formulário
  pages/
    Dashboard.tsx
    Condominios.tsx
    Funcionarios.tsx
    Transacoes.tsx
    Lembretes.tsx
  hooks/
    useCondominios.ts
    useFuncionarios.ts
    useTransacoes.ts
    useLembretes.ts
	
Páginas principais:

O Dashboard mostra um resumo do fluxo de caixa do mês (receitas x despesas), com Cards de shadcn/ui, e uma lista de lembretes pendentes em destaque (usando Badge/Alert). A página de Condomínios lista os cadastros em uma Table, com Dialog para criar/editar e um switch para ativar/inativar. A página de Funcionários segue o mesmo padrão, com campos de salário e benefícios. A página de Transações tem um formulário unificado (com campos condicionais conforme tipo/categoria escolhida) e uma tabela filtrável por mês, tipo e categoria. A página de Lembretes lista os alertas de renovação de contrato, permitindo marcá-los como resolvidos.

7. Critérios de Aceite (MVP)
O sistema deve permitir cadastrar, editar e inativar condomínios sem perder o histórico de transações associadas. Deve permitir cadastrar e inativar funcionários. Todo lançamento em transacoes deve exigir tipo, categoria, valor e data. O dashboard deve somar corretamente receitas e despesas do período selecionado. O job mensal deve gerar exatamente um lembrete por condomínio por aniversário de contrato, sem duplicações, visível na tela de Lembretes.

8. Roadmap Sugerido
Fase 1: modelagem do banco no Supabase, autenticação simples, CRUD de condomínios e funcionários. 
Fase 2: CRUD de transações com formulário unificado e dashboard de resumo. 
Fase 3: implementação do job de lembretes (pg_cron) e tela de lembretes. 
Fase 4  geração automática de despesas mensais recorrentes de salário/benefício por funcionário ativo, e relatórios mensais exportáveis.
Como o projeto terá seu banco feito no Supabase , acesse minha conta lá crie o projeto, pegue a URL e a chave para configurar e gerar o banco do o schema SQL inicial.