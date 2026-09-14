import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, AlertCircle, BarChart3 } from 'lucide-react'

export default function RelatorioCondominio({ condominioId, condominioNome, onBack }) {
  // Dados simulados - em produção viriam do Supabase
  const [periodo, setPeriodo] = useState('mes') // 'mes' ou 'ano'

  // Simulando dados do condomínio
  const condominio = {
    id: condominioId,
    nome: condominioNome,
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Flores, 123 - Blumenau, SC',
    data_inicio: '2022-01-15',
    valor_contrato: 5000.00
  }

  // Simulando transações
  const transacoes = [
    { id: 1, descricao: 'Salário - João Silva', categoria: 'Salário', tipo: 'despesa', valor: 2500, data: '2024-09-05' },
    { id: 2, descricao: 'Salário - Maria Santos', categoria: 'Salário', tipo: 'despesa', valor: 2000, data: '2024-09-05' },
    { id: 3, descricao: 'Benefícios', categoria: 'Benefício', tipo: 'despesa', valor: 500, data: '2024-09-05' },
    { id: 4, descricao: 'INSS - Encargos', categoria: 'Encargo', tipo: 'despesa', valor: 1237.50, data: '2024-09-10' },
    { id: 5, descricao: 'FGTS - Encargos', categoria: 'Encargo', tipo: 'despesa', valor: 400, data: '2024-09-10' },
    { id: 6, descricao: 'Imposto Municipal', categoria: 'Imposto', tipo: 'despesa', valor: 250, data: '2024-09-15' },
    { id: 7, descricao: 'Imposto Estadual', categoria: 'Imposto', tipo: 'despesa', valor: 150, data: '2024-09-15' },
    { id: 8, descricao: 'Material de Limpeza', categoria: 'Material de Limpeza', tipo: 'despesa', valor: 300, data: '2024-09-20' },
    { id: 9, descricao: 'Receita - Contrato', categoria: 'Contrato', tipo: 'receita', valor: 5000, data: '2024-09-01' },
    { id: 10, descricao: 'Serviço Extra', categoria: 'Serviço Extra', tipo: 'receita', valor: 800, data: '2024-09-10' },
  ]

  // Cálculos
  const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0)
  const despesas = transacoes.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0)
  const lucroLiquido = receitas - despesas

  // Detalhes de despesas
  const despesasPorCategoria = {
    salarios: transacoes.filter(t => t.tipo === 'despesa' && t.categoria === 'Salário').reduce((sum, t) => sum + t.valor, 0),
    beneficios: transacoes.filter(t => t.tipo === 'despesa' && t.categoria === 'Benefício').reduce((sum, t) => sum + t.valor, 0),
    encargos: transacoes.filter(t => t.tipo === 'despesa' && t.categoria === 'Encargo').reduce((sum, t) => sum + t.valor, 0),
    impostos: transacoes.filter(t => t.tipo === 'despesa' && t.categoria === 'Imposto').reduce((sum, t) => sum + t.valor, 0),
    outros: transacoes.filter(t => t.tipo === 'despesa' && (t.categoria === 'Material de Limpeza' || t.categoria === 'Outros')).reduce((sum, t) => sum + t.valor, 0),
  }

  const percentualSalarios = ((despesasPorCategoria.salarios / despesas) * 100).toFixed(1)
  const percentualEncargos = ((despesasPorCategoria.encargos / despesas) * 100).toFixed(1)
  const percentualImpostos = ((despesasPorCategoria.impostos / despesas) * 100).toFixed(1)
  const percentualOutros = (((despesasPorCategoria.beneficios + despesasPorCategoria.outros) / despesas) * 100).toFixed(1)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const isLucro = lucroLiquido >= 0

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Voltar para Condomínios
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{condominio.nome}</h1>
          <p className="text-gray-600 dark:text-gray-400">CNPJ: {condominio.cnpj}</p>
          <p className="text-gray-600 dark:text-gray-400">{condominio.endereco}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Valor do Contrato</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(condominio.valor_contrato)}
                </p>
              </div>
              <DollarSign className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Receitas</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(receitas)}
                </p>
              </div>
              <TrendingUp className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Despesas</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {formatCurrency(despesas)}
                </p>
              </div>
              <TrendingDown className="text-red-600 dark:text-red-400" size={32} />
            </div>
          </div>

          <div className={`${isLucro ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {isLucro ? 'Lucro Líquido' : 'Prejuízo'}
                </p>
                <p className={`text-2xl font-bold mt-1 ${isLucro ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {formatCurrency(lucroLiquido)}
                </p>
              </div>
              <BarChart3 className={`${isLucro ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`} size={32} />
            </div>
          </div>
        </div>

        {/* Análise de Despesas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 size={24} />
              Análise de Despesas
            </h2>

            <div className="space-y-4">
              {/* Salários */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Salários</span>
                  <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(despesasPorCategoria.salarios)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentualSalarios}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{percentualSalarios}% das despesas</p>
              </div>

              {/* Encargos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Encargos (INSS, FGTS, etc)</span>
                  <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(despesasPorCategoria.encargos)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${percentualEncargos}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{percentualEncargos}% das despesas</p>
              </div>

              {/* Impostos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Impostos</span>
                  <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(despesasPorCategoria.impostos)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${percentualImpostos}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{percentualImpostos}% das despesas</p>
              </div>

              {/* Outros */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Outros</span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {formatCurrency(despesasPorCategoria.beneficios + despesasPorCategoria.outros)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-600 h-2 rounded-full"
                    style={{ width: `${percentualOutros}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{percentualOutros}% das despesas</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Total de Despesas:</strong> {formatCurrency(despesas)}
              </p>
            </div>
          </div>

          {/* Indicadores */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Indicadores Financeiros</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Margem de Lucro</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {isLucro ? ((lucroLiquido / receitas) * 100).toFixed(1) : '-'}{isLucro ? '%' : ''}
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Taxa de Despesa</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {((despesas / receitas) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Resultado do Período</p>
                <p className={`text-2xl font-bold ${isLucro ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(lucroLiquido)}
                </p>
              </div>

              {!isLucro && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-300 text-sm">Atenção!</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">Este contrato está gerando prejuízo.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transações Detalhadas */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Transações Detalhadas</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Categoria</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(t.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{t.descricao}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.categoria === 'Salário' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        t.categoria === 'Encargo' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                        t.categoria === 'Imposto' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                        t.categoria === 'Contrato' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {t.categoria}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${
                      t.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.tipo === 'receita' ? '+' : '-'} {formatCurrency(t.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
