# ✅ Checklist de Instalação e Setup

Use este checklist para garantir que tudo está configurado corretamente.

## 📦 Pré-requisitos

- [ ] Node.js 16+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Git instalado (opcional)

## 🚀 Setup Inicial

### Passo 1: Instalar Dependências
```bash
cd GVSolucoes
npm install
```
- [ ] Comando executado sem erros
- [ ] Pasta `node_modules/` criada
- [ ] Arquivo `package-lock.json` criado

### Passo 2: Verificar Estrutura
- [ ] Arquivo `index.html` existe (novo)
- [ ] Pasta `src/` existe com arquivos React
- [ ] Arquivo `vite.config.js` existe
- [ ] Arquivo `tailwind.config.js` existe

### Passo 3: Rodar Servidor de Desenvolvimento
```bash
npm run dev
```
- [ ] Servidor inicia sem erros
- [ ] Exibe "Local: http://localhost:5173"
- [ ] Aplicação abre no navegador automaticamente

## 🎨 Testar Funcionalidades

### Dashboard
- [ ] Página carrega com 4 cards de resumo
- [ ] Exibe transações recentes
- [ ] Mostra lembretes de renovação

### Condomínios
- [ ] Tabela com 2 condomínios de exemplo
- [ ] Botão "Novo Condomínio" funciona
- [ ] Pode editar um condomínio
- [ ] Pode ativar/inativar
- [ ] Formulário abre e fecha

### Funcionários
- [ ] Tabela com 2 funcionários de exemplo
- [ ] Pode criar novo funcionário
- [ ] Campos de salário e benefícios aparecem
- [ ] Toggle de ativo/inativo funciona

### Transações
- [ ] Lista de 4 transações de exemplo
- [ ] Cards de resumo (receitas, despesas, saldo)
- [ ] Formulário permite criar transação
- [ ] Categorias mudam conforme tipo (receita/despesa)
- [ ] Pode deletar uma transação

### Lembretes
- [ ] Mostra lembretes pendentes com ícone ⚠️
- [ ] Mostra lembretes resolvidos com ✓
- [ ] Pode marcar como resolvido
- [ ] Contador de pendentes/resolvidos correto

### Tema Claro/Escuro
- [ ] Ícone lua/sol no header funciona
- [ ] Interface muda entre claro e escuro
- [ ] Cores estão legíveis em ambos os temas
- [ ] Preferência persiste ao recarregar página
- [ ] Transição é suave

### Responsividade
- [ ] Menu não aparece em desktop
- [ ] Menu é acessível em mobile (ícone hambúrguer)
- [ ] Conteúdo adapta ao tamanho da tela
- [ ] Tabelas scrollam horizontalmente em mobile

## 🔌 Supabase (Opcional)

Se quiser integrar com Supabase:

### Passo 1: Criar Conta
- [ ] Criar conta em supabase.com
- [ ] Criar novo projeto
- [ ] Copiar URL e chave pública

### Passo 2: Criar Banco de Dados
- [ ] Abrir SQL Editor no Supabase
- [ ] Copiar e executar código de `schema.sql`
- [ ] Verificar se tabelas foram criadas

### Passo 3: Configurar Variáveis
- [ ] Criar arquivo `.env` (copiar de `.env.example`)
- [ ] Adicionar `VITE_SUPABASE_URL`
- [ ] Adicionar `VITE_SUPABASE_ANON_KEY`
- [ ] Salvar arquivo

### Passo 4: Testar Conexão
- [ ] Abrir `src/lib/supabaseClient.js`
- [ ] Verificar que importações estão corretas
- [ ] Testar chamadas em componentes (futura integração)

## 📁 Arquivos Importante

- [ ] `index.html` - Novo e funcional
- [ ] `src/App.jsx` - Roteamento principal
- [ ] `src/pages/*.jsx` - Todas as 5 páginas criadas
- [ ] `src/lib/supabaseClient.js` - API pronta para usar
- [ ] `schema.sql` - SQL para criar banco
- [ ] `.env.example` - Modelo de variáveis

## 📚 Documentação

- [ ] `README.md` - Leia para entender o projeto
- [ ] `GETTING_STARTED.md` - Siga para setup passo a passo
- [ ] `SETUP_LOGO.md` - Para adicionar logo
- [ ] `RESUMO_PROJETO.md` - Visão geral do que foi criado

## 🎉 Pronto para Começar!

Quando tudo estiver marcado, você está pronto para:
- [ ] Desenvolver novas funcionalidades
- [ ] Integrar com Supabase
- [ ] Customizar cores e branding
- [ ] Fazer deploy

## 🐛 Troubleshooting

Se algo não funcionar:

**Porta 5173 já está em uso**
```bash
npm run dev -- --port 3000
```

**Erro de módulos**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind não está carregando**
- Reinicie o servidor dev
- Limpe cache do navegador (Ctrl+Shift+Del)

**Tema não muda**
- Abra DevTools (F12)
- Verifique localStorage (Application > Local Storage)
- Procure por "theme"

---

**Status**: ✅ Sistema pronto para uso
**Data**: Setembro 2026
**Versão**: 1.0 MVP
