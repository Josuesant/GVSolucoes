# 📖 Guia de Uso - GV Soluções

## 🚀 Começando

### Passo 1: Abrir a Aplicação

```bash
cd C:\Users\franc\OneDrive\Documentos\Repo\GVSolucoes
npm run dev
```

Acesse: **http://localhost:5173**

Você verá a tela de login.

---

## 🔐 Tela de Login

### Faça Login com Dados Demo

```
┌─────────────────────────────────────┐
│        🔐 GV Soluções               │
├─────────────────────────────────────┤
│                                     │
│  Email                              │
│  [test@gv.com                     ] │
│                                     │
│  Senha                              │
│  [••••••••                         ] │
│                                     │
│         [ 🔒 Entrar ]               │
│                                     │
│  Não tem conta? Registre-se         │
│                                     │
│  💡 Demo: test@gv.com / 123456      │
└─────────────────────────────────────┘
```

**Dados para teste:**
- Email: `test@gv.com`
- Senha: `123456`

### Ou Registre uma Nova Conta

```
1. Clique em "Registre-se"
2. Preencha:
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
3. Clique em "Criar Conta"
4. Será automaticamente logado
```

---

## 📊 Dashboard

Após fazer login, você vê:

```
┌────────────────────────────────────────────────────────────┐
│ GV Soluções | 📊 Dashboard                        🌙       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────┐  ┌──────────────┐  ┌────────────────┐    │
│ │ 📊           │  │ 📊           │  │ 💳             │    │
│ │ Receitas     │  │ Despesas     │  │ Saldo          │    │
│ │              │  │              │  │                │    │
│ │ R$ 15.000    │  │ R$ 8.500     │  │ R$ 6.500       │    │
│ └──────────────┘  └──────────────┘  └────────────────┘    │
│                                                             │
│ TRANSAÇÕES RECENTES:                                        │
│ • Salário João Silva ....... -R$ 2.500 (05/09)            │
│ • Receita Condomínio ........ +R$ 5.000 (01/09)           │
│ • INSS Encargos ............ -R$ 1.237 (10/09)            │
│                                                             │
│ PRÓXIMAS RENOVAÇÕES:                                        │
│ • Condomínio Center ......... Setembro 2024               │
└────────────────────────────────────────────────────────────┘
```

**O que você vê:**
- ✅ Resumo de receitas, despesas e saldo
- ✅ Transações mais recentes
- ✅ Lembretes de renovação

---

## 🏢 Menu Lateral

```
┌──────────────────┐
│ GV Soluções      │
│ Gestão Financeira│
├──────────────────┤
│                  │
│ 📊 Dashboard     │◄─ Atual
│                  │
│ 🏢 Condomínios   │
│                  │
│ 👥 Funcionários  │
│                  │
│ 💳 Transações    │
│                  │
│ 🔔 Lembretes     │
│                  │
├──────────────────┤
│ Usuário Demo     │
│ test@gv.com      │
│                  │
│ [ 🚪 Sair ]     │
└──────────────────┘
```

**Como usar:**
- Clique em cada item para navegar
- Seu usuário aparece no final
- Clique em "Sair" para fazer logout

---

## 🏢 Gerenciar Condomínios

### Listar Condomínios

```
┌─────────────────────────────────────────────────────────────┐
│ 🏢 Condomínios                           [+ Novo Condomínio] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Nome           │ CNPJ        │ Endereço    │ Valor   │Status│
├────────────────┼─────────────┼─────────────┼─────────┤─────┤
│ Condomínio    │ 12.345.678/ │ Av.        │ R$ 5.0  │ 🟢   │
│ Center       │ 0001-90      │ Principal   │ 00      │Ativo │
│ 🔗 (clique    │             │             │         │      │
│   para ver    │             │             │         │      │
│   relatório)  │             │             │         │      │
├────────────────┼─────────────┼─────────────┼─────────┤─────┤
│ Residencial   │ 98.765.432/ │ Rua das    │ R$ 3.5  │ 🟢   │
│ Flores       │ 0001-10      │ Flores      │ 00      │Ativo │
│ 🔗            │             │             │         │      │
└────────────────┼─────────────┼─────────────┼─────────┴─────┘
```

### Adicionar Novo Condomínio

```
1. Clique em "+ Novo Condomínio"

   ┌─────────────────────────────────┐
   │ Novo Condomínio                 │
   ├─────────────────────────────────┤
   │                                 │
   │ Nome                            │
   │ [Condomínio Center            ] │
   │                                 │
   │ CNPJ                            │
   │ [12.345.678/0001-90           ] │
   │                                 │
   │ Endereço                        │
   │ [Av. Principal, 100           ] │
   │                                 │
   │ Valor Contrato (R$)             │
   │ [5000.00                      ] │
   │                                 │
   │ [ Cancelar ]  [ Salvar ]         │
   └─────────────────────────────────┘

2. Preencha os dados
3. Clique em "Salvar"
4. Aparecerá na lista
```

### Ver Relatório do Condomínio

```
1. Clique no NOME do condomínio (azul, com ícone 🔗)

2. Abrirá a página de Relatório:
   
   ┌──────────────────────────────────────┐
   │ ◀ Voltar para Condomínios            │
   │                                      │
   │ CONDOMÍNIO CENTER                    │
   │ CNPJ: 12.345.678/0001-90            │
   │ Av. Principal, 100                   │
   │                                      │
   │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
   │ │Contrato │ │Receitas │ │Despesas │ │
   │ │R$ 5.000 │ │R$ 5.800 │ │R$ 7.237 │ │
   │ └─────────┘ └─────────┘ └─────────┘ │
   │                                      │
   │ ANÁLISE DE DESPESAS:                 │
   │ Salários: ████████ 68.8%            │
   │ Encargos: ██░░░░░░ 22.4%            │
   │ Impostos: ░░░░░░░░ 5.5%             │
   │ Outros:   ░░░░░░░░ 3.3%             │
   │                                      │
   │ RESULTADO: -R$ 1.437 (PREJUÍZO)     │
   │ ⚠️ Atenção! Prejuízo neste mês.     │
   └──────────────────────────────────────┘

3. Veja a análise completa
4. Clique em "◀ Voltar" para retornar
```

---

## 👥 Gerenciar Funcionários

### Adicionar Funcionário

```
1. Clique em "👥 Funcionários" no menu

2. Clique em "+ Novo Funcionário"

   ┌────────────────────────────┐
   │ Novo Funcionário           │
   ├────────────────────────────┤
   │ Nome                       │
   │ [João Silva              ] │
   │                            │
   │ CPF                        │
   │ [123.456.789-00          ] │
   │                            │
   │ Telefone                   │
   │ [(11) 99999-9999         ] │
   │                            │
   │ Salário Bruto              │
   │ [3000.00                 ] │
   │                            │
   │ Salário Líquido            │
   │ [2400.00                 ] │
   │                            │
   │ Benefícios                 │
   │ [300.00                  ] │
   │                            │
   │ [ Cancelar ] [ Salvar ]     │
   └────────────────────────────┘

3. Preencha os dados
4. Clique em "Salvar"
```

---

## 💳 Registrar Transações

### Adicionar Receita ou Despesa

```
1. Clique em "💳 Transações" no menu

2. Clique em "+ Nova Transação"

   ┌─────────────────────────────┐
   │ Nova Transação              │
   ├─────────────────────────────┤
   │ Tipo                        │
   │ [▼ Receita / Despesa      ] │
   │                             │
   │ Descrição                   │
   │ [Salário - João Silva     ] │
   │                             │
   │ Valor (R$)                  │
   │ [2500.00                  ] │
   │                             │
   │ Categoria                   │
   │ [▼ Salário / Imposto      ] │
   │   (Varia por tipo)          │
   │                             │
   │ Condomínio                  │
   │ [▼ Condomínio Center      ] │
   │                             │
   │ Data                        │
   │ [05/09/2024               ] │
   │                             │
   │ [ Cancelar ] [ Salvar ]     │
   └─────────────────────────────┘

3. Selecione o tipo (Receita/Despesa)
4. Escolha a categoria apropriada
5. Preencha os dados
6. Clique em "Salvar"
```

**Categorias:**
- Receita: Contrato, Serviço Extra
- Despesa: Imposto, Material, Salário, Benefício

---

## 🌙 Alternar Tema

### Claro ↔ Escuro

```
No header, à direita, clique em:
☀️  (sol) = modo claro
🌙 (lua) = modo escuro

Sua preferência é salva automaticamente!
```

**Como funciona:**
- Clique no ícone para alternar
- Tema persiste mesmo fechando o app
- Aplicado em todas as páginas

---

## 🔔 Gerenciar Lembretes

### Ver Lembretes

```
1. Clique em "🔔 Lembretes" no menu

2. Você vê:
   
   ┌──────────────────────────────┐
   │ 🔔 Lembretes                 │
   ├──────────────────────────────┤
   │                              │
   │ PENDENTES:                   │
   │ ⚠️ Renovação - Condomínio    │
   │    Center em 15 dias         │
   │    [ ✓ Resolver ]            │
   │                              │
   │ RESOLVIDOS:                  │
   │ ✅ Contrato assinado com    │
   │    Residencial Flores        │
   │                              │
   └──────────────────────────────┘

3. Clique em "✓ Resolver" quando terminar
```

---

## 🚪 Fazer Logout

```
1. Clique no menu (se em mobile)
   └─ Ou vá para o final da sidebar

2. Vê suas informações:
   ┌──────────────────┐
   │ Usuário Demo     │
   │ test@gv.com      │
   │                  │
   │ [ 🚪 Sair ]      │
   └──────────────────┘

3. Clique em "Sair"

4. Será redirecionado para Login
```

---

## 📱 Usar em Mobile

### Menu Hamburger

```
Em telas pequenas:
- Clique em ≡ (hambúrguer) para abrir menu
- Clique novamente ou fora do menu para fechar
- Tema toggle fica no header

┌──────────────────────────────┐
│ ≡ Dashboard         🌙        │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ GV Soluções             │ │
│ │                          │ │
│ │ 📊 Dashboard            │ │
│ │ 🏢 Condomínios          │ │
│ │ 👥 Funcionários         │ │
│ │                          │ │
│ │ [ 🚪 Sair ]              │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

## 🆘 Troubleshooting

### "Página fica em branco"
```
Solução:
1. Abra Console (F12)
2. Procure por erros em vermelho
3. Se for erro de import, verifique se
   o arquivo existe em src/pages/
```

### "Login não funciona"
```
Solução:
1. Verifique se localStorage está limpo:
   localStorage.clear()
2. Atualize a página (F5)
3. Tente fazer login novamente
```

### "Relatório não carrega"
```
Solução:
1. Verifique se tem condominios criados
2. Tente clicar de novo no nome
3. Limpe localStorage e tente novamente
```

### "Tema não persiste"
```
Solução:
1. Verifique se localStorage está habilitado
2. Atualize a página após mudar tema
3. Verifique console por erros
```

---

## 💡 Dicas e Truques

### 1. Dados de Teste Rápido
```javascript
// No Console do DevTools (F12):
localStorage.setItem('gv_users', JSON.stringify([
  { id: '1', email: 'test@gv.com', password: '123456', name: 'Demo' }
]))
```

### 2. Ver Dados Salvos
```javascript
// No Console:
console.log(JSON.parse(localStorage.getItem('gv_current_user')))
console.log(JSON.parse(localStorage.getItem('gv_users')))
```

### 3. Resetar Tudo
```javascript
// No Console:
localStorage.clear()
// Depois F5 para recarregar
```

### 4. Mudar Tema Programaticamente
```javascript
// No Console:
document.documentElement.classList.toggle('dark')
localStorage.setItem('gv_theme', 'dark')
```

---

## 📊 Exemplo de Uso Completo

### Cenário: Gerenciar Condomínio

```
1. Faz Login
   └─ Email: test@gv.com
   └─ Senha: 123456

2. Vai para Condomínios
   └─ Vê lista (se houver)

3. Clica em "+ Novo Condomínio"
   └─ Nome: Condomínio Novo
   └─ CNPJ: 11.111.111/0001-11
   └─ Valor: 4000.00
   └─ Clica Salvar

4. Vai para Funcionários
   └─ Adiciona: João Silva (R$ 2.500)
   └─ Adiciona: Maria Santos (R$ 2.000)

5. Vai para Transações
   └─ Receita: Contrato (R$ 4.000)
   └─ Despesa: Salário João (R$ 2.500)
   └─ Despesa: Salário Maria (R$ 2.000)

6. Volta para Condomínios
   └─ Clica em "Condomínio Novo"

7. Vê Relatório
   └─ Receita: R$ 4.000
   └─ Despesa: R$ 4.500
   └─ Resultado: -R$ 500 (PREJUÍZO)
   └─ Alerta: "Aumente o contrato!"

8. Volta e clica em Sair
```

---

## 🎯 Checklist de Funcionalidades

Durante seu uso, verifique:

- [ ] Login com email e senha funciona
- [ ] Registro de novo usuário funciona
- [ ] Dashboard carrega com dados corretos
- [ ] Adicionar condomínio funciona
- [ ] Clique no nome abre relatório
- [ ] Relatório mostra análise financeira
- [ ] Alternância de tema funciona
- [ ] Tema persiste após refresh
- [ ] Logout funciona e volta para login
- [ ] Menu mobile abre e fecha
- [ ] Tabelas responsivas em mobile

---

## 📖 Resumo

| Ação | Resultado |
|------|-----------|
| Login | Vê Dashboard com menu |
| Novo Condomínio | Aparece na lista |
| Clica em condomínio | Abre Relatório |
| Vê Relatório | Análise financeira |
| Clica tema | Alterna claro/escuro |
| Clica Sair | Volta para Login |

---

**Aproveite a aplicação! 🎉**

Versão: 1.1.0  
Data: 12/09/2026
