-- Extensão necessária para gerar UUIDs
create extension if not exists "pgcrypto";

-- Tabela: usuarios (Autenticação e Autorização)
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  senha_hash text not null,
  nome text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela: condominios (Fontes de Receita Fixa)
create table if not exists condominios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  nome text not null,
  cnpj text not null,
  endereco text,
  data_inicio_contrato date not null,
  valor_contrato numeric(12,2) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(usuario_id, cnpj)
);

-- Tabela: funcionarios (Despesas Fixas com Pessoal)
create table if not exists funcionarios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  nome text not null,
  cpf text not null,
  telefone text,
  salario_bruto numeric(12,2) not null,
  salario_liquido numeric(12,2) not null,
  beneficios numeric(12,2) default 0,
  encargos numeric(12,2) default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(usuario_id, cpf)
);

-- Enums para o fluxo de caixa
create type tipo_transacao as enum ('receita', 'despesa');
create type categoria_transacao as enum (
  'Contrato', 'Serviço Extra', 'Imposto', 'Material de Limpeza', 'Salário', 'Benefício', 'Encargo', 'Outros'
);

-- Tabela: transacoes (Fluxo de Caixa Real)
create table if not exists transacoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  condominio_id uuid references condominios(id) on delete set null,
  funcionario_id uuid references funcionarios(id) on delete set null,
  descricao text not null,
  valor numeric(12,2) not null,
  tipo tipo_transacao not null,
  categoria categoria_transacao not null,
  data_lancamento date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela: lembretes (Alertas de Renovação de Contrato)
create table if not exists lembretes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  condominio_id uuid not null references condominios(id) on delete cascade,
  tipo text not null default 'renovacao_contrato',
  mensagem text not null,
  data_referencia date not null,
  resolvido boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habilitar Row Level Security (RLS)
alter table usuarios enable row level security;
alter table condominios enable row level security;
alter table funcionarios enable row level security;
alter table transacoes enable row level security;
alter table lembretes enable row level security;

-- Policies para usuarios (cada usuário pode ver apenas seus próprios dados)
create policy "Enable read access for own user data"
  on usuarios for select
  using (auth.uid() = id);

create policy "Enable update for own user data"
  on usuarios for update
  using (auth.uid() = id);

-- Policies para condominios (usuário vê apenas seus condominios)
create policy "Enable read access for user condominios"
  on condominios for select
  using (usuario_id = auth.uid());

create policy "Enable insert for user condominios"
  on condominios for insert
  with check (usuario_id = auth.uid());

create policy "Enable update for user condominios"
  on condominios for update
  using (usuario_id = auth.uid());

create policy "Enable delete for user condominios"
  on condominios for delete
  using (usuario_id = auth.uid());

-- Policies para funcionarios
create policy "Enable read access for user funcionarios"
  on funcionarios for select
  using (usuario_id = auth.uid());

create policy "Enable insert for user funcionarios"
  on funcionarios for insert
  with check (usuario_id = auth.uid());

create policy "Enable update for user funcionarios"
  on funcionarios for update
  using (usuario_id = auth.uid());

create policy "Enable delete for user funcionarios"
  on funcionarios for delete
  using (usuario_id = auth.uid());

-- Policies para transacoes
create policy "Enable read access for user transacoes"
  on transacoes for select
  using (usuario_id = auth.uid());

create policy "Enable insert for user transacoes"
  on transacoes for insert
  with check (usuario_id = auth.uid());

create policy "Enable update for user transacoes"
  on transacoes for update
  using (usuario_id = auth.uid());

create policy "Enable delete for user transacoes"
  on transacoes for delete
  using (usuario_id = auth.uid());

-- Policies para lembretes
create policy "Enable read access for user lembretes"
  on lembretes for select
  using (usuario_id = auth.uid());

create policy "Enable insert for user lembretes"
  on lembretes for insert
  with check (usuario_id = auth.uid());

create policy "Enable update for user lembretes"
  on lembretes for update
  using (usuario_id = auth.uid());

create policy "Enable delete for user lembretes"
  on lembretes for delete
  using (usuario_id = auth.uid());

-- Função para gerar lembretes de renovação
create or replace function public.gerar_lembretes_renovacao()
returns void
language plpgsql
as $$
declare
  proxima_data date;
begin
  insert into lembretes (usuario_id, condominio_id, mensagem, data_referencia)
  select
    c.usuario_id,
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

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger update_usuarios_updated_at before update on usuarios
  for each row execute function update_updated_at_column();

create trigger update_condominios_updated_at before update on condominios
  for each row execute function update_updated_at_column();

create trigger update_funcionarios_updated_at before update on funcionarios
  for each row execute function update_updated_at_column();

create trigger update_transacoes_updated_at before update on transacoes
  for each row execute function update_updated_at_column();

create trigger update_lembretes_updated_at before update on lembretes
  for each row execute function update_updated_at_column();

-- Índices para melhor performance
create index if not exists idx_condominios_usuario on condominios(usuario_id);
create index if not exists idx_funcionarios_usuario on funcionarios(usuario_id);
create index if not exists idx_transacoes_usuario on transacoes(usuario_id);
create index if not exists idx_transacoes_condominio on transacoes(condominio_id);
create index if not exists idx_transacoes_data on transacoes(data_lancamento);
create index if not exists idx_transacoes_tipo on transacoes(tipo);
create index if not exists idx_lembretes_usuario on lembretes(usuario_id);
create index if not exists idx_lembretes_condominio on lembretes(condominio_id);
create index if not exists idx_lembretes_resolvido on lembretes(resolvido);
