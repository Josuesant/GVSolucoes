import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Condominios from './pages/Condominios'
import Funcionarios from './pages/Funcionarios'
import Transacoes from './pages/Transacoes'
import Lembretes from './pages/Lembretes'
import RelatorioCondominio from './pages/RelatorioCondominio'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedCondominioId, setSelectedCondominioId] = useState(null)
  const [selectedCondominioNome, setSelectedCondominioNome] = useState(null)

  // Inicializar tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('gv_theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Verificar login ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem('gv_current_user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }

    // Inicializar usuário de demo se não existir
    const users = JSON.parse(localStorage.getItem('gv_users') || '[]')
    if (users.length === 0) {
      localStorage.setItem('gv_users', JSON.stringify([
        {
          id: 'demo-user',
          email: 'test@gv.com',
          password: '123456',
          name: 'Usuário Demo'
        }
      ]))
    }
  }, [])

  // Atualizar tema
  const updateTheme = (isDark) => {
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('gv_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('gv_theme', 'light')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('gv_current_user')
    setCurrentUser(null)
    setCurrentPage('dashboard')
  }

  // Abrir relatório de condomínio
  const openRelatorio = (condominioId, condominioNome) => {
    setSelectedCondominioId(condominioId)
    setSelectedCondominioNome(condominioNome)
    setCurrentPage('relatorio')
    setSidebarOpen(false)
  }

  // Fechar relatório
  const closeRelatorio = () => {
    setSelectedCondominioId(null)
    setSelectedCondominioNome(null)
    setCurrentPage('condominios')
  }

  // Se não está logado, mostrar página de login
  if (!currentUser) {
    return <Login onLoginSuccess={setCurrentUser} />
  }

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'condominios', label: 'Condomínios', icon: '🏢' },
    { id: 'funcionarios', label: 'Funcionários', icon: '👥' },
    { id: 'transacoes', label: 'Transações', icon: '💳' },
    { id: 'lembretes', label: 'Lembretes', icon: '🔔' },
  ]

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">GV</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gestão Financeira</p>
          </div>

          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Usuário</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {currentPage === 'relatorio' ? selectedCondominioNome + ' - Relatório' : menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
                </h2>
              </div>

              <button
                onClick={() => updateTheme(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                title={darkMode ? 'Modo claro' : 'Modo escuro'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 sm:p-6">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'condominios' && (
              <Condominios onSelectCondominio={openRelatorio} />
            )}
            {currentPage === 'funcionarios' && <Funcionarios />}
            {currentPage === 'transacoes' && <Transacoes />}
            {currentPage === 'lembretes' && <Lembretes />}
            {currentPage === 'relatorio' && (
              <RelatorioCondominio
                condominioId={selectedCondominioId}
                condominioNome={selectedCondominioNome}
                onBack={closeRelatorio}
              />
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
