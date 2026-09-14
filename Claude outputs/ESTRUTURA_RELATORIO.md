# 📊 Estrutura do Relatório de Condomínio

## 🎯 Visão Geral

O relatório detalhado mostra a análise financeira completa de um condomínio específico, com breakdowns de receitas, despesas e indicadores financeiros.

---

## 📱 Layout da Página

```
┌─────────────────────────────────────────────────────────────────┐
│ ◀ Voltar para Condomínios                                       │
├─────────────────────────────────────────────────────────────────┤
│ CONDOMÍNIO CENTER                                               │
│ CNPJ: 12.345.678/0001-90                                        │
│ Endereço: Av. Principal, 100 - Blumenau, SC                     │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┤
│ │ Valor do     │  │ Receitas     │  │ Despesas     │  │ Lucro  │
│ │ Contrato     │  │              │  │              │  │ Líquido│
│ │              │  │              │  │              │  │        │
│ │ R$ 5.000,00  │  │ R$ 5.800,00  │  │ R$ 7.237,50  │  │ -R$ 1  │
│ └──────────────┘  └──────────────┘  └──────────────┘  └────────┤
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ANÁLISE DE DESPESAS          │  INDICADORES FINANCEIROS        │
│                               │                                 │
│ Salários                      │  Margem de Lucro: -24.8%        │
│ ████████████████░░ 68.8%      │  Taxa de Despesa: 125%          │
│ R$ 4.980,00                   │  Resultado: -R$ 1.437,50        │
│                               │  ⚠️ Prejuízo neste contrato     │
│ Encargos                      │                                 │
│ ███████░░░░░░░░░░ 22.4%       │                                 │
│ R$ 1.622,50                   │                                 │
│                               │                                 │
│ Impostos                      │                                 │
│ ██░░░░░░░░░░░░░░░░ 5.5%       │                                 │
│ R$ 400,00                     │                                 │
│                               │                                 │
│ Outros                        │                                 │
│ ░░░░░░░░░░░░░░░░░░ 3.3%       │                                 │
│ R$ 235,00                     │                                 │
├─────────────────────────────────────────────────────────────────┤
│ TRANSAÇÕES DETALHADAS                                           │
├─────────────────────────────────────────────────────────────────┤
│ Data         │ Descrição              │ Categoria    │ Valor   │
├──────────────┼────────────────────────┼──────────────┼─────────┤
│ 05/09/2024   │ Salário - João Silva   │ Salário      │ -2.500  │
│ 05/09/2024   │ Salário - Maria Santos │ Salário      │ -2.000  │
│ 05/09/2024   │ Benefícios             │ Benefício    │ -500    │
│ 10/09/2024   │ INSS - Encargos        │ Encargo      │ -1.237  │
│ 10/09/2024   │ FGTS - Encargos        │ Encargo      │ -400    │
│ 15/09/2024   │ Imposto Municipal      │ Imposto      │ -250    │
│ 15/09/2024   │ Imposto Estadual       │ Imposto      │ -150    │
│ 20/09/2024   │ Material de Limpeza    │ Outros       │ -300    │
│ 01/09/2024   │ Receita - Contrato     │ Contrato     │ +5.000  │
│ 10/09/2024   │ Serviço Extra          │ Extra        │ +800    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Dados Simulados para Teste

### Condomínio Exemplo
```json
{
  "id": 1,
  "nome": "Condomínio Center",
  "cnpj": "12.345.678/0001-90",
  "endereco": "Av. Principal, 100 - Blumenau, SC",
  "data_inicio": "2022-01-15",
  "valor_contrato": 5000.00
}
```

### Transações do Mês
```
RECEITAS:
- Contrato: R$ 5.000,00 (99%)
- Serviço Extra: R$ 800,00 (14%)
TOTAL: R$ 5.800,00

DESPESAS:
- Salários: R$ 4.500,00 (62%)
  ├─ João Silva: R$ 2.500,00
  └─ Maria Santos: R$ 2.000,00

- Benefícios: R$ 500,00 (7%)

- Encargos: R$ 1.637,50 (22%)
  ├─ INSS: R$ 1.237,50 (INSS patrão)
  └─ FGTS: R$ 400,00

- Impostos: R$ 400,00 (5%)
  ├─ Municipal: R$ 250,00
  └─ Estadual: R$ 150,00

- Outros: R$ 300,00 (4%)
  └─ Material de Limpeza

TOTAL: R$ 7.237,50
```

### Resultado Final
```
Receitas:      R$  5.800,00  (100%)
Despesas:      R$  7.237,50  (125%)
Lucro/Prejuízo: -R$ 1.437,50  (-25%)

Status: ❌ PREJUÍZO
Aviso: Este contrato está gerando prejuízo
```

---

## 🔄 Fluxo de Clique

```
1. Usuário está em "Condomínios"
   └─ Tabela com lista de condomínios

2. Clica no nome do condomínio (com ícone 🔗)
   └─ Função: onSelectCondominio(id, nome)

3. App.jsx atualiza:
   └─ currentPage = 'relatorio'
   └─ selectedCondominioId = id
   └─ selectedCondominioNome = nome

4. Renderiza RelatorioCondominio.jsx
   └─ Passa props: condominioId, condominioNome, onBack

5. Relatório carrega dados:
   └─ Busca transações do condomínio
   └─ Calcula receitas, despesas, lucro
   └─ Agrupa por categoria
   └─ Renderiza gráficos e tabelas

6. Usuário pode:
   ├─ Ver análise completa
   ├─ Exportar (futuro)
   └─ Voltar clicando em "◀ Voltar para Condomínios"
```

---

## 💾 Estrutura de Dados no Banco

### Tabela: usuarios
```sql
id (UUID)           -- ID do usuário
email (TEXT)        -- Email único
senha_hash (TEXT)   -- Senha criptografada (será adicionado)
nome (TEXT)         -- Nome do usuário
ativo (BOOLEAN)     -- Se está ativo
created_at          -- Data de criação
updated_at          -- Última atualização
```

### Tabela: condominios
```sql
id (UUID)              -- ID do condomínio
usuario_id (UUID)      -- FK para usuarios
nome (TEXT)            -- Nome do condomínio
cnpj (TEXT)            -- CNPJ único
endereco (TEXT)        -- Endereço
data_inicio_contrato   -- Data do contrato
valor_contrato         -- Valor mensal
ativo (BOOLEAN)        -- Ativo/Inativo
created_at, updated_at
```

### Tabela: transacoes
```sql
id (UUID)              -- ID da transação
usuario_id (UUID)      -- FK para usuarios
condominio_id (UUID)   -- FK para condominios
funcionario_id (UUID)  -- FK para funcionarios (opcional)
descricao (TEXT)       -- Descrição
valor (NUMERIC)        -- Valor
tipo (ENUM)            -- 'receita' ou 'despesa'
categoria (ENUM)       -- Categoria da transação
data_lancamento        -- Data da transação
created_at, updated_at
```

---

## 🧮 Fórmulas Utilizadas

### Cálculos Básicos
```javascript
Receitas = SUM(transacoes WHERE tipo = 'receita')
Despesas = SUM(transacoes WHERE tipo = 'despesa')
Lucro = Receitas - Despesas
```

### Análise por Categoria
```javascript
Salários = SUM(despesas WHERE categoria = 'Salário')
Encargos = SUM(despesas WHERE categoria = 'Encargo')
Impostos = SUM(despesas WHERE categoria = 'Imposto')
Benefícios = SUM(despesas WHERE categoria = 'Benefício')
Outros = SUM(despesas WHERE categoria = 'Outros')

TotalDespesas = Salários + Encargos + Impostos + Benefícios + Outros
```

### Indicadores
```javascript
MargemDeLucro = (Lucro / Receitas) * 100
TaxaDeDespesa = (Despesas / Receitas) * 100
PercentualPorCategoria = (ValorCategoria / TotalDespesas) * 100
```

### Interpretação
```
Margem de Lucro:
- > 20%: Excelente
- 10-20%: Bom
- 0-10%: Aceitável
- < 0%: Prejuízo ❌

Taxa de Despesa:
- < 80%: Excelente
- 80-100%: Normal
- > 100%: Insustentável ⚠️
```

---

## 🎨 Paleta de Cores

```
Receitas (Positivo):   Verde      (#10B981)
Despesas (Negativo):   Vermelho   (#EF4444)
Salários:              Azul       (#3B82F6)
Encargos:              Laranja    (#F97316)
Impostos:              Vermelho   (#DC2626)
Outros:                Cinza      (#6B7280)
Lucro (Positivo):      Esmeralda  (#059669)
Prejuízo (Negativo):   Laranja    (#EA580C)
```

---

## 📈 Próximas Versões

### v1.2 - Gráficos e Visualizações
- [ ] Gráfico de Pizza (Despesas por Categoria)
- [ ] Gráfico de Linha (Evolução do Lucro)
- [ ] Gráfico de Barras (Receitas vs Despesas)

### v1.3 - Relatórios Avançados
- [ ] Comparação entre períodos
- [ ] Projeção para o ano
- [ ] Análise de tendências
- [ ] Export em PDF

### v1.4 - Alertas e Notificações
- [ ] Alerta quando lucro < 10%
- [ ] Sugestão de aumento de contrato
- [ ] Notificação de despesas incomuns

---

## 🔗 Componentes Relacionados

- **Login.jsx** - Autenticação do usuário
- **App.jsx** - Gerenciador de estado e navegação
- **Condominios.jsx** - Lista e permite clicar
- **RelatorioCondominio.jsx** - Exibe análise detalhada
- **supabaseClient.js** - Funções para buscar dados

---

**Versão:** 1.1.0  
**Data:** 12/09/2026  
**Status:** ✅ Pronto para Implementação
