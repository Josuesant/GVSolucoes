# 🚀 Guia de Início Rápido - GV Soluções

## O que foi criado?

Um sistema completo de gestão financeira para empresas prestadoras de serviços a condomínios, com interface moderna, tema claro/escuro e pronto para integrar com Supabase.

## 📦 Estrutura de Arquivos Criados

```
GVSolucoes/
├── index.html              # Novo arquivo HTML (substituiu o antigo)
├── package.json           # Dependências do projeto
├── vite.config.js         # Configuração Vite
├── tailwind.config.js     # Configuração Tailwind CSS
├── postcss.config.js      # Configuração PostCSS
├── schema.sql             # Script SQL para criar banco
├── .gitignore             # Arquivos ignorados pelo Git
├── .env.example           # Exemplo de variáveis de ambiente
├── README.md              # Documentação do projeto
├── GETTING_STARTED.md     # Este arquivo
└── src/
    ├── main.jsx           # Entrada da aplicação
    ├── App.jsx            # Componente principal com roteamento
    ├── index.css          # Estilos globais Tailwind
    ├── lib/
    │   └── supabaseClient.js  # Integração Supabase
    ├── components/        # (Vazio por enquanto, pronto para expansão)
    ├── hooks/            # (Pronto para hooks customizados)
    └── pages/
        ├── Dashboard.jsx
        ├── Condominios.jsx
        ├── Funcionarios.jsx
        ├── Transacoes.jsx
        └── Lembretes.jsx
```

## ⚡ Próximos Passos

### Passo 1: Instalar Dependências

```bash
cd GVSolucoes
npm install
```

### Passo 2: Configurar Supabase (Opcional para Testes)

Se quiser integrar de verdade com Supabase:

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. No painel SQL Editor, execute o código do arquivo `schema.sql`
4. Copie suas credenciais:
   - URL do Projeto
   - Chave Anônima (anon key)
5. Crie arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

6. Atualize o arquivo `src/lib/supabaseClient.js` para usar as credenciais

### Passo 3: Rodar o Projeto

```bash
npm run dev
```

O sistema abrirá automaticamente em `http://localhost:5173`

## 🎨 Funcionalidades Implementadas

✅ **Dashboard**
- Resumo de receitas, despesas e saldo
- Últimas transações
- Próximas renovações de contrato
- Cards informativos com ícones

✅ **Condomínios**
- CRUD completo (criar, ler, atualizar)
- Ativar/Inativar sem perder histórico
- Tabela responsiva
- Validação básica

✅ **Funcionários**
- Gestão de pessoal
- Controle de salário bruto/líquido
- Registro de benefícios
- Status ativo/inativo

✅ **Transações**
- Receitas e Despesas
- Categorização automática
- Filtros por tipo
- Resumo do período

✅ **Lembretes**
- Alertas de renovação
- Status pendente/resolvido
- Histórico completo
- Interface intuitiva

✅ **Interface**
- **Tema Claro/Escuro**: Alterne clicando no ícone (lua/sol)
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Menu Lateral**: Navegação clara entre seções
- **Cores Consistentes**: Palette Tailwind profissional

## 🔧 Personalizações Sugeridas

### 1. Adicionar Logo
O arquivo `logo-svg.png` já existe na pasta. Para usá-lo:
- Coloque o arquivo em `src/assets/` (crie a pasta)
- Importe em `App.jsx`:
```jsx
import logo from '../assets/logo-svg.png'
```
- Use em `<img src={logo} alt="GV Soluções" />`

### 2. Customizar Cores
Edite `tailwind.config.js` para ajustar a paleta de cores:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#seu-cor-aqui',
        // ...
      }
    }
  }
}
```

### 3. Adicionar Autenticação
Use as funções em `src/lib/supabaseClient.js`:
```javascript
import { auth } from './lib/supabaseClient'

// Login
const { data, error } = await auth.signIn(email, password)

// Logout
await auth.signOut()
```

## 📱 Modo de Uso

### Dashboard
- Visão geral do financeiro do mês
- Acesso rápido a informações críticas

### Condomínios
- **Novo**: Botão com ícone + na parte superior
- **Editar**: Clique no ícone de lápis
- **Ativar/Inativar**: Clique no toggle

### Funcionários
- Similar ao fluxo de Condomínios
- Salários e benefícios por pessoa

### Transações
- **Adicionar**: Clique "Nova Transação"
- **Categorias Dinâmicas**: Mudam conforme tipo (receita/despesa)
- **Deletar**: Ícone de lixo na tabela

### Lembretes
- Visualize automaticamente as renovações
- Marque como resolvido (checkmark verde)
- Histórico de resolvidas

## 🌙 Tema Escuro

O tema é automaticamente salvo no `localStorage`. Próximas visitas usarão a preferência anterior.

## 🐛 Debug

Se algo não funcionar:

1. **Abra o Console** (F12 no navegador)
2. **Verifique Erros** nas abas Console e Network
3. **Limpe Cache** (Ctrl+Shift+Delete)
4. **Reinstale Dependências** (`rm -rf node_modules && npm install`)

## 📖 Documentação Completa

Veja `README.md` para mais detalhes sobre arquitetura, segurança e roadmap.

## ✨ Próximos Passos Recomendados

1. **Conectar Supabase**: Integre o banco de dados
2. **Implementar Login**: Use Supabase Auth
3. **Adicionar Gráficos**: Use bibliotecas como `recharts`
4. **Exportar Relatórios**: PDF/Excel com dados
5. **Notificações**: Toast alerts com Sonner

## 💬 Dúvidas?

Consulte os arquivos:
- `README.md` - Visão geral do projeto
- `schema.sql` - Estrutura do banco
- `src/lib/supabaseClient.js` - Como usar a API

Bom trabalho! 🚀
