import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'
import { transacaoFunctions, condominioFunctions } from '../lib/supabaseClient'

export default function Dashboard({ currentUser }) {
  const [stats, setStats] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0
  })
  const [recentTransacoes, setRecentTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [currentUser])

  const loadDashboardData = async () => {
    if (!currentUser || !currentUser.id) return

    try {
      setLoading(true)
      setError('')

      // Carregar todas as transações do usuário
      const transacoes = await transacaoFunctions.list(currentUser.id)

      // Calcular totais
      let receitas = 0
      let despesas = 0

      transacoes.forEach(t => {
        if (t.tipo === 'receita') {
          receitas += t.valor
        } else {
          despesas += t.valor
        }
      })

      const saldo = receitas - despesas

      setStats({
        receitas,
        despesas,
        saldo
      })

      // Pegar últimas 5 transações
      setRecentTransacoes(transacoes.slice(0, 5))
    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Visão geral de suas finanças</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receitas */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Receitas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(stats.receitas)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Despesas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(stats.despesas)}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </div>

        {/* Saldo */}
        <div className={`bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 ${stats.saldo >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Saldo</p>
              <p className={`text-2xl font-bold mt-2 ${stats.saldo >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(stats.saldo)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stats.saldo >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
              {stats.saldo >= 0 ? (
                <CheckCircle className="text-blue-600 dark:text-blue-400" size={24} />
              ) : (
                <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transações Recentes</h4>

        {recentTransacoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>Nenhuma transação registrada</p>
            <p className="text-xs mt-2">Comece adicionando condominios e transações</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransacoes.map((transacao) => (
              <div key={transacao.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transacao.descricao}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transacao.data_lancamento)} • {transacao.categoria}
                  </p>
                </div>
                <div className={`text-right ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  <p className="font-bold">
                    {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    transacao.tipo === 'receita'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>Dica:</strong> Para análises detalhadas de cada condomínio, acesse a página de Condomínios e clique no nome do condomínio para ver o relatório completo.
        </p>
      </div>
    </div>
  )
}
