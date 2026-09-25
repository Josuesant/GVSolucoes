import { useState, useEffect } from 'react'
import { LogIn, AlertCircle } from 'lucide-react'
import { authFunctions } from '../lib/supabaseClient'

export default function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        const result = await authFunctions.signin('ge@gvsolucoes.com.br', 'UsuarioGVSolucoes.01')

        if (result.success) {
          // Armazenar usuário no localStorage como backup
          localStorage.setItem('gv_current_user', JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            name: result.user.nome || result.user.email
          }))

          // Aguardar um pouco antes de fazer login (para melhor UX)
          setTimeout(() => {
            onLoginSuccess(result.user)
          }, 500)
        } else {
          setError(result.error || 'Erro ao conectar')
          setLoading(false)
        }
      } catch (err) {
        setError('Falha ao conectar: ' + err.message)
        setLoading(false)
      }
    }

    performAutoLogin()
  }, [onLoginSuccess])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <LogIn className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GV Soluções</h1>
          </div>

          {/* Loading or Error State */}
          {loading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Conectando...</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Usuário: ge@gvsolucoes.com.br
              </p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-left">
                  <p className="text-red-700 dark:text-red-300 text-sm font-semibold">Erro ao conectar</p>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Tentar Novamente
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Verifique se suas credenciais do Supabase estão corretas no arquivo .env
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
