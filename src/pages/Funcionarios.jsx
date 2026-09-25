import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { funcionarioFunctions } from '../lib/supabaseClient'

export default function Funcionarios({ currentUser }) {
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ nome: '', cpf: '', salario: '', cargo: '' })
  const [isSaving, setIsSaving] = useState(false)

  // Carregar funcionários ao montar componente
  useEffect(() => {
    loadFuncionarios()
  }, [currentUser])

  const loadFuncionarios = async () => {
    if (!currentUser || !currentUser.id) return

    try {
      setLoading(true)
      setError('')
      const data = await funcionarioFunctions.list(currentUser.id)
      setFuncionarios(data || [])
    } catch (err) {
      setError('Erro ao carregar funcionários: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.nome || !formData.cpf || !formData.salario) {
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
        cpf: formData.cpf,
        salario: parseFloat(formData.salario),
        cargo: formData.cargo,
        ativo: true
      }

      if (editingId) {
        await funcionarioFunctions.update(editingId, dataToSave)
      } else {
        await funcionarioFunctions.create(currentUser.id, dataToSave)
      }

      await loadFuncionarios()
      setFormData({ nome: '', cpf: '', salario: '', cargo: '' })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (funcionario) => {
    setFormData({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      salario: funcionario.salario,
      cargo: funcionario.cargo
    })
    setEditingId(funcionario.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este funcionário?')) {
      try {
        await funcionarioFunctions.delete(id)
        await loadFuncionarios()
      } catch (err) {
        alert('Erro ao deletar: ' + err.message)
      }
    }
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
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Funcionários</h3>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ nome: '', cpf: '', salario: '', cargo: '' })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Novo Funcionário
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
              {editingId ? 'Editar Funcionário' : 'Novo Funcionário'}
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
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  placeholder="Ex: Gerente"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salário (R$)
                </label>
                <input
                  type="number"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
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
                <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">CPF</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Cargo</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Salário</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {funcionario.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{funcionario.cpf}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{funcionario.cargo}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(funcionario.salario)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(funcionario)}
                        className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition"
                      >
                        <Edit2 size={16} className="text-yellow-600 dark:text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(funcionario.id)}
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

          {funcionarios.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum funcionário cadastrado. Clique em "Novo Funcionário" para começar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
