import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, BarChart3, Home, Users, DollarSign, Bell, LogOut } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Condominios from './pages/Condominios'
import Funcionarios from './pages/Funcionarios'
import Transacoes from './pages/Transacoes'
import Lembretes from './pages/Lembretes'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Inicializar tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const isDark = savedTheme === 'dark'
    setDarkMode(isDark)
    updateTheme(isDark)
  }, [])

  const updateTheme = (isDark) => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    updateTheme(newMode)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'condominios', label: 'Condomínios', icon: BarChart3 },
    { id: 'funcionarios', label: 'Funcionários', icon: Users },
    { id: 'transacoes', label: 'Transações', icon: DollarSign },
    { id: 'lembretes', label: 'Lembretes', icon: Bell },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'condominios':
        return <Condominios />
      case 'funcionarios':
        return <Funcionarios />
      case 'transacoes':
        return <Transacoes />
      case 'lembretes':
        return <Lembretes />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 z-20`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GV</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">GV Soluções</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gestão Financeira</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    setMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-slate-800">
          <button className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-900 dark:text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white hidden md:block">
            {menuItems.find(item => item.id === currentPage)?.label}
          </h2>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>

      {/* Overlay para mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default App
