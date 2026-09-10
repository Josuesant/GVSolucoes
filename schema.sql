-- Extensão necessária para gerar UUIDs
create extension if not exists "pgcrypto";

-- Tabela: condominios (Fontes de Receita Fixa)
create table if not exists condominios (
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
create table if not exists funcionarios (
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
create table if not exists transacoes (
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
create table if not exists lembretes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references condominios(id) on delete cascade,
  tipo text not null default 'renovacao_contrato',
  mensagem text not null,
  data_referencia date not null,
  resolvido boolean not null default false,
  created_at timestamptz not null default now()
);

-- Habilitar Row Level Security (RLS)
alter table condominios enable row level security;
alter table funcionarios enable row level security;
alter table transacoes enable row level security;
alter table lembretes enable row level security;

-- Policies para condominios
create policy "Enable read access for authenticated users on condominios"
  on condominios for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users on condominios"
  on condominios for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users on condominios"
  on condominios for update
  using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users on condominios"
  on condominios for delete
  using (auth.role() = 'authenticated');

-- Policies para funcionarios
create policy "Enable read access for authenticated users on funcionarios"
  on funcionarios for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users on funcionarios"
  on funcionarios for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users on funcionarios"
  on funcionarios for update
  using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users on funcionarios"
  on funcionarios for delete
  using (auth.role() = 'authenticated');

-- Policies para transacoes
create policy "Enable read access for authenticated users on transacoes"
  on transacoes for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users on transacoes"
  on transacoes for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users on transacoes"
  on transacoes for update
  using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users on transacoes"
  on transacoes for delete
  using (auth.role() = 'authenticated');

-- Policies para lembretes
create policy "Enable read access for authenticated users on lembretes"
  on lembretes for select
  using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users on lembretes"
  on lembretes for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users on lembretes"
  on lembretes for update
  using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users on lembretes"
  on lembretes for delete
  using (auth.role() = 'authenticated');

-- Função para gerar lembretes de renovação
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

-- Índices para melhor performance
create index if not exists idx_transacoes_data on transacoes(data_lancamento);
create index if not exists idx_transacoes_tipo on transacoes(tipo);
create index if not exists idx_transacoes_condominio on transacoes(condominio_id);
create index if not exists idx_lembretes_condominio on lembretes(condominio_id);
create index if not exists idx_lembretes_resolvido on lembretes(resolvido);
