import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Power, ExternalLink } from 'lucide-react'
import { condominioFunctions } from '../lib/supabaseClient'

export default function Condominios({ currentUser, onSelectCondominio }) {
  const [condominios, setCondominios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ nome: '', cnpj: '', endereco: '', valor_contrato: '' })
  const [isSaving, setIsSaving] = useState(false)

  // Carregar condomínios ao montar componente
  useEffect(() => {
    loadCondominios()
  }, [currentUser])

  const loadCondominios = async () => {
    if (!currentUser || !currentUser.id) return

    try {
      setLoading(true)
      setError('')
      const data = await condominioFunctions.list(currentUser.id)
      setCondominios(data || [])
    } catch (err) {
      setError('Erro ao carregar condomínios: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.nome || !formData.cnpj || !formData.valor_contrato) {
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
        nome: formData.nome,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        valor_contrato: parseFloat(formData.valor_contrato),
        ativo: true
      }

      if (editingId) {
        await condominioFunctions.update(editingId, dataToSave)
      } else {
        await condominioFunctions.create(currentUser.id, dataToSave)
      }

      await loadCondominios()
      setFormData({ nome: '', cnpj: '', endereco: '', valor_contrato: '' })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (condominio) => {
    setFormData({
      nome: condominio.nome,
      cnpj: condominio.cnpj,
      endereco: condominio.endereco,
      valor_contrato: condominio.valor_contrato
    })
    setEditingId(condominio.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este condomínio?')) {
      try {
        await condominioFunctions.delete(id)
        await loadCondominios()
      } catch (err) {
        alert('Erro ao deletar: ' + err.message)
      }
    }
  }

  const handleToggle = async (condominio) => {
    try {
      await condominioFunctions.update(condominio.id, { ativo: !condominio.ativo })
      await loadCondominios()
    } catch (err) {
      alert('Erro ao atualizar: ' + err.message)
    }
  }

  const handleSelectCondominio = (id, nome) => {
    onSelectCondominio(id, nome)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header with Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Condomínios</h3>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ nome: '', cnpj: '', endereco: '', valor_contrato: '' })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Novo Condomínio
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
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingId ? 'Editar Condomínio' : 'Novo Condomínio'}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do condomínio"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Endereço do condomínio"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Contrato (R$)
                </label>
                <input
                  type="number"
                  value={formData.valor_contrato}
                  onChange={(e) => setFormData({ ...formData, valor_contrato: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Nome</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">CNPJ</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Endereço</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Valor</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {condominios.map((condominio) => (
                <tr key={condominio.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectCondominio(condominio.id, condominio.nome)}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 group"
                      title="Clique para ver relatório detalhado"
                    >
                      {condominio.nome}
                      <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{condominio.cnpj}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{condominio.endereco}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(condominio.valor_contrato)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      condominio.ativo
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {condominio.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleToggle(condominio)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="Toggle status"
                      >
                        <Power size={16} className={condominio.ativo ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                      </button>
                      <button
                        onClick={() => handleEdit(condominio)}
                        className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition"
                      >
                        <Edit2 size={16} className="text-yellow-600 dark:text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(condominio.id)}
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

          {condominios.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum condomínio cadastrado. Clique em "Novo Condomínio" para começar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
