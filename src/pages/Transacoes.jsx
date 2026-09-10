import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState([
    { id: 1, descricao: 'Contrato Condomínio A', valor: 5000, tipo: 'receita', categoria: 'Contrato', data: '2024-09-08' },
    { id: 2, descricao: 'Folha de Pagamento', valor: 5400, tipo: 'despesa', categoria: 'Salário', data: '2024-09-08' },
    { id: 3, descricao: 'Compra Material Limpeza', valor: 450, tipo: 'despesa', categoria: 'Material de Limpeza', data: '2024-09-07' },
    { id: 4, descricao: 'Serviço Extra Condomínio B', valor: 1200, tipo: 'receita', categoria: 'Serviço Extra', data: '2024-09-06' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ descricao: '', valor: '', tipo: 'receita', categoria: '', data: '' })

  const categorias = {
    receita: ['Contrato', 'Serviço Extra'],
    despesa: ['Imposto', 'Material de Limpeza', 'Salário', 'Benefício']
  }

  const handleSave = () => {
    if (formData.descricao && formData.valor && formData.categoria && formData.data) {
      setTransacoes([...transacoes, { ...formData, id: Date.now(), valor: parseFloat(formData.valor) }])
      setFormData({ descricao: '', valor: '', tipo: 'receita', categoria: '', data: '' })
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    setTransacoes(transacoes.filter(t => t.id !== id))
  }

  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0)
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transações</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Receitas</p>
          <p className="text-2xl font-bold text-green-600">R$ {totalReceitas.toLocaleString('pt-BR')}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-600">R$ {totalDespesas.toLocaleString('pt-BR')}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Saldo</p>
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-sky-600' : 'text-red-600'}`}>R$ {saldo.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Nova Transação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Descrição"
              className="input"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor"
              className="input"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            />
            <select
              className="input"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value, categoria: '' })}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            <select
              className="input"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            >
              <option value="">Selecione a categoria</option>
              {categorias[formData.tipo].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              className="input"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary">Salvar</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Descrição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Categoria</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Valor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Data</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">Ação</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr key={transacao.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{transacao.descricao}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{transacao.categoria}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${transacao.tipo === 'receita' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                    {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toLocaleString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{transacao.data}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(transacao.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
