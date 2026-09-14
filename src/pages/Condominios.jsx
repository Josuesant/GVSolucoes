import { useState } from 'react'
import { Plus, Edit2, Trash2, Power, ExternalLink } from 'lucide-react'

export default function Condominios({ onSelectCondominio }) {
  const [condominios, setCondominios] = useState([
    { id: 1, nome: 'Condomínio Center', cnpj: '12.345.678/0001-90', endereco: 'Av. Principal, 100', valor: 5000, ativo: true },
    { id: 2, nome: 'Residencial Flores', cnpj: '98.765.432/0001-10', endereco: 'Rua das Flores, 200', valor: 3500, ativo: true },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ nome: '', cnpj: '', endereco: '', valor: '' })

  const handleSave = () => {
    if (!formData.nome || !formData.cnpj || !formData.valor) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (editingId) {
      setCondominios(condominios.map(c =>
        c.id === editingId ? { ...c, ...formData, valor: parseFloat(formData.valor) } : c
      ))
      setEditingId(null)
    } else {
      setCondominios([...condominios, {
        ...formData,
        id: Date.now(),
        valor: parseFloat(formData.valor),
        ativo: true
      }])
    }
    setFormData({ nome: '', cnpj: '', endereco: '', valor: '' })
    setShowForm(false)
  }

  const handleEdit = (condominio) => {
    setFormData(condominio)
    setEditingId(condominio.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este condomínio?')) {
      setCondominios(condominios.filter(c => c.id !== id))
    }
  }

  const handleToggle = (id) => {
    setCondominios(condominios.map(c =>
      c.id === id ? { ...c, ativo: !c.ativo } : c
    ))
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
            setFormData({ nome: '', cnpj: '', endereco: '', valor: '' })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Novo Condomínio
        </button>
      </div>

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
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
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
                  {formatCurrency(condominio.valor)}
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
                      onClick={() => handleToggle(condominio.id)}
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
    </div>
  )
}
