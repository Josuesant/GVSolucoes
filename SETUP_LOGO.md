# 🎨 Como Integrar a Logo

A logo `logo-svg.png` já existe na pasta. Aqui está como usá-la no sistema.

## Opção 1: Logo no Sidebar (Recomendado)

A logo já está implementada no `App.jsx` com um design simples (iniciais "GV" em círculo azul).

Se quiser usar a imagem `logo-svg.png`, siga os passos:

### 1. Criar Pasta de Assets

```bash
mkdir -p src/assets
```

### 2. Copiar Logo

```bash
cp logo-svg.png src/assets/
```

### 3. Atualizar App.jsx

No arquivo `src/App.jsx`, substitua a seção do logo (por volta da linha 54):

**De:**
```jsx
<div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-lg">GV</span>
</div>
```

**Para:**
```jsx
<img 
  src={require('../assets/logo-svg.png')} 
  alt="GV Soluções" 
  className="w-10 h-10 rounded-lg"
/>
```

Ou com import ES6:
```jsx
import logo from '../assets/logo-svg.png'

// E depois na JSX:
<img 
  src={logo} 
  alt="GV Soluções" 
  className="w-10 h-10 rounded-lg"
/>
```

## Opção 2: Logo no Dashboard Header

Adicione em `src/pages/Dashboard.jsx` no início:

```jsx
import logo from '../assets/logo-svg.png'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <img src={logo} alt="GV Soluções" className="w-12 h-12 rounded-lg" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">GV Soluções</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestão Financeira</p>
        </div>
      </div>
      {/* ... resto do código ... */}
    </div>
  )
}
```

## Opção 3: Logo na Aba do Navegador (Favicon)

Para usar como favicon (ícone na aba):

1. Converta `logo-svg.png` para `.ico` (usando uma ferramenta online)
2. Coloque em `public/favicon.ico`
3. No `index.html`, adicione:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

## Ajustar Tamanho da Logo

Use as classes Tailwind:
- `w-10 h-10` - Pequeno (40px)
- `w-12 h-12` - Médio (48px)  
- `w-16 h-16` - Grande (64px)
- `w-24 h-24` - Extra grande (96px)

## Exemplo Completo com Logo

```jsx
// src/App.jsx
import logo from './assets/logo-svg.png'

function App() {
  // ... código anterior ...
  
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src={logo} 
              alt="GV Soluções" 
              className="w-10 h-10 rounded-lg shadow-md"
            />
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">GV Soluções</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gestão Financeira</p>
            </div>
          </div>
          {/* ... rest of code ... */}
        </div>
      </div>
    </div>
  )
}
```

## Troubleshooting

**Problema: Imagem não aparece**
- Verifique se o caminho está correto
- Verifique as permissões do arquivo
- Tente usar `require()` em vez de `import`

**Problema: Logo pixelada**
- Se for PNG, tente converter para SVG
- Ajuste os tamanhos (w-10, w-12, etc.)

**Problema: Tema escuro distorce logo**
- Adicione filtro de cor:
```jsx
<img 
  src={logo} 
  alt="GV" 
  className="w-10 h-10 rounded-lg dark:invert dark:brightness-110"
/>
```

Pronto! 🎨
