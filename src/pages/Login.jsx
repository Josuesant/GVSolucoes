import { useState } from 'react'
import { LogIn, UserPlus, AlertCircle } from 'lucide-react'

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Simulando login - em produção usar Supabase Auth
        const users = JSON.parse(localStorage.getItem('gv_users') || '[]')
        const user = users.find(u => u.email === email && u.password === password)

        if (!user) {
          setError('Email ou senha incorretos')
          setLoading(false)
          return
        }

        // Simular armazenamento de sessão
        localStorage.setItem('gv_current_user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name
        }))

        onLoginSuccess(user)
      } else {
        // Registro
        const users = JSON.parse(localStorage.getItem('gv_users') || '[]')

        if (users.find(u => u.email === email)) {
          setError('Email já cadastrado')
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Senha deve ter no mínimo 6 caracteres')
          setLoading(false)
          return
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          password, // Em produção, usar bcrypt no backend
          name
        }

        users.push(newUser)
        localStorage.setItem('gv_users', JSON.stringify(users))
        localStorage.setItem('gv_current_user', JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }))

        onLoginSuccess(newUser)
      }
    } catch (err) {
      setError('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <LogIn className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GV Soluções</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {isLogin ? 'Acesse sua conta' : 'Crie uma nova conta'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processando...
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setEmail('')
                  setPassword('')
                  setName('')
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                {isLogin ? 'Registre-se' : 'Faça login'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Demo:</strong> Use email: test@gv.com | Senha: 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
