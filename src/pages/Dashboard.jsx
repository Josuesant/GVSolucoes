import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  // Dados de exemplo (em produção viriam do Supabase)
  const stats = {
    receitas: 15000,
    despesas: 8500,
    saldo: 6500,
    lembretes: 3
  }

  const recentes = [
    { id: 1, descricao: 'Contrato Condomínio A', valor: 5000, tipo: 'receita', data: '2024-09-08' },
    { id: 2, descricao: 'Folha de Pagamento', valor: 8500, tipo: 'despesa', data: '2024-09-08' },
    { id: 3, descricao: 'Material de Limpeza', valor: 450, tipo: 'despesa', data: '2024-09-07' },
  ]

  const lembretes = [
    { id: 1, titulo: 'Renovação - Condomínio B', data: '2024-10-15', status: 'pendente' },
    { id: 2, titulo: 'Renovação - Condomínio C', data: '2024-11-20', status: 'pendente' },
    { id: 3, titulo: 'Renovação - Condomínio D', data: '2024-12-10', status: 'pendente' },
  ]

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Receitas</p>
              <p className="text-3xl font-bold text-green-600">R$ {stats.receitas.toLocaleString('pt-BR')}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Despesas</p>
              <p className="text-3xl font-bold text-red-600">R$ {stats.despesas.toLocaleString('pt-BR')}</p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Saldo</p>
              <p className="text-3xl font-bold text-sky-600">R$ {stats.saldo.toLocaleString('pt-BR')}</p>
            </div>
            <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
              <span className="text-sky-600 font-bold">$</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Lembretes</p>
              <p className="text-3xl font-bold text-amber-600">{stats.lembretes}</p>
            </div>
            <AlertCircle className="text-amber-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transações Recentes */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Transações Recentes</h3>
          <div className="space-y-3">
            {recentes.map((transacao) => (
              <div key={transacao.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{transacao.descricao}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{transacao.data}</p>
                </div>
                <p className={`font-bold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lembretes de Renovação */}
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Próximas Renovações</h3>
          <div className="space-y-3">
            {lembretes.map((lembrete) => (
              <div key={lembrete.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={16} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{lembrete.titulo}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lembrete.data}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
