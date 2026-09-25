import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { transacaoFunctions, condominioFunctions } from '../lib/supabaseClient'

export default function Transacoes({ currentUser }) {
  const [transacoes, setTransacoes] = useState([])
  const [condominios, setCondominios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterTipo, setFilterTipo] = useState('todas')
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    categoria: 'Salário',
    condominio_id: '',
    data_lancamento: new Date().toISOString().split('T')[0]
  })
  const [isSaving, setIsSaving] = useState(false)

  // Categorias por tipo
  const categoriasPorTipo = {
    receita: ['Contrato', 'Extra', 'Multa', 'Outro'],
    despesa: ['Salário', 'Encargo', 'Imposto', 'Benefício', 'Outro']
  }

  // Carregar dados ao montar componente
  useEffect(() => {
    loadData()
  }, [currentUser])

  const loadData = async () => {
    if (!currentUser || !currentUser.id) return

    try {
      setLoading(true)
      setError('')
      const [transacoes, condominios] = await Promise.all([
        transacaoFunctions.list(currentUser.id),
        condominioFunctions.list(currentUser.id)
      ])
      setTransacoes(transacoes || [])
      setCondominios(condominios || [])

      // Definir primeiro condomínio como padrão se houver
      if (condominios && condominios.length > 0 && !formData.condominio_id) {
        setFormData(prev => ({ ...prev, condominio_id: condominios[0].id }))
      }
    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.descricao || !formData.valor || !formData.condominio_id) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (!currentUser || !currentUser.id) {
      alert('Usuário não identificado')
      return
    }

    try {
      setIsSaving(true)
      const dataToSave = {
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        tipo: formData.tipo,
        categoria: formData.categoria,
        condominio_id: formData.condominio_id,
        data_lancamento: formData.data_lancamento
      }

      if (editingId) {
        await transacaoFunctions.update(editingId, dataToSave)
      } else {
        await transacaoFunctions.create(currentUser.id, dataToSave)
      }

      await loadData()
      resetForm()
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      tipo: 'despesa',
      categoria: 'Salário',
      condominio_id: condominios.length > 0 ? condominios[0].id : '',
      data_lancamento: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (transacao) => {
    setFormData({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoria: transacao.categoria,
      condominio_id: transacao.condominio_id,
      data_lancamento: transacao.data_lancamento
    })
    setEditingId(transacao.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await transacaoFunctions.delete(id)
        await loadData()
      } catch (err) {
        alert('Erro ao deletar: ' + err.message)
      }
    }
  }

  const getCondominioNome = (id) => {
    return condominios.find(c => c.id === id)?.nome || 'N/A'
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

  // Filtrar transações
  const transacoesFiltradas = filterTipo === 'todas' ? transacoes : transacoes.filter(t => t.tipo === filterTipo)

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h3>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingId ? 'Editar Transação' : 'Nova Transação'}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Condomínio
                </label>
                <select
                  value={formData.condominio_id}
                  onChange={(e) => setFormData({ ...formData, condominio_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Selecione um condomínio</option>
                  {condominios.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => {
                    const newTipo = e.target.value
                    setFormData({
                      ...formData,
                      tipo: newTipo,
                      categoria: categoriasPorTipo[newTipo][0]
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  {categoriasPorTipo[formData.tipo].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Salário - João Silva"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data_lancamento}
                  onChange={(e) => setFormData({ ...formData, data_lancamento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-blue-400 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterTipo('todas')}
          className={`px-4 py-2 rounded-lg transition ${
            filterTipo === 'todas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilterTipo('receita')}
          className={`px-4 py-2 rounded-lg transition ${
            filterTipo === 'receita'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
        >
          Receitas
        </button>
        <button
          onClick={() => setFilterTipo('despesa')}
          className={`px-4 py-2 rounded-lg transition ${
            filterTipo === 'despesa'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
        >
          Despesas
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Data</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Condomínio</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Descrição</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Categoria</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Valor</th>
              <th className="text-center px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
              <th className="text-center px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transacoesFiltradas.map((transacao) => (
              <tr key={transacao.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatDate(transacao.data_lancamento)}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">{getCondominioNome(transacao.condominio_id)}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{transacao.descricao}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">{transacao.categoria}</td>
                <td className={`px-6 py-4 text-right font-semibold ${
                  transacao.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    transacao.tipo === 'receita'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(transacao)}
                      className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition"
                    >
                      <Edit2 size={16} className="text-yellow-600 dark:text-yellow-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(transacao.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transacoesFiltradas.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Nenhuma transação encontrada. Clique em "Nova Transação" para começar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
