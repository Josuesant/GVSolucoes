import { useState } from 'react'
import { Plus, Edit2, Trash2, Power } from 'lucide-react'

export default function Condominios() {
  const [condominios, setCondominios] = useState([
    { id: 1, nome: 'Condomínio A', cnpj: '12.345.678/0001-90', endereco: 'Rua A, 100', valor: 5000, ativo: true, data_inicio: '2023-01-15' },
    { id: 2, nome: 'Condomínio B', cnpj: '98.765.432/0001-10', endereco: 'Rua B, 200', valor: 4500, ativo: true, data_inicio: '2023-06-10' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ nome: '', cnpj: '', endereco: '', valor: '', data_inicio: '' })

  const handleSave = () => {
    if (editingId) {
      setCondominios(condominios.map(c => c.id === editingId ? { ...formData, id: editingId } : c))
      setEditingId(null)
    } else {
      setCondominios([...condominios, { ...formData, id: Date.now(), ativo: true }])
    }
    setFormData({ nome: '', cnpj: '', endereco: '', valor: '', data_inicio: '' })
    setShowForm(false)
  }

  const handleEdit = (condominio) => {
    setFormData(condominio)
    setEditingId(condominio.id)
    setShowForm(true)
  }

  const toggleAtivo = (id) => {
    setCondominios(condominios.map(c => c.id === id ? { ...c, ativo: !c.ativo } : c))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Condomínios</h2>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nome: '', cnpj: '', endereco: '', valor: '', data_inicio: '' }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Condomínio
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Editar' : 'Novo'} Condomínio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome do Condomínio"
              className="input"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <input
              type="text"
              placeholder="CNPJ"
              className="input"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            />
            <input
              type="text"
              placeholder="Endereço"
              className="input"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor do Contrato"
              className="input"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            />
            <input
              type="date"
              className="input"
              value={formData.data_inicio}
              onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary">
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">CNPJ</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Valor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">Ações</th>
            </tr>
          </thead>
          <tbody>
            {condominios.map((condominio) => (
              <tr key={condominio.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{condominio.nome}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{condominio.cnpj}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">R$ {condominio.valor.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${condominio.ativo ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300'}`}>
                    {condominio.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(condominio)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button onClick={() => toggleAtivo(condominio.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <Power size={16} className={condominio.ativo ? 'text-green-600' : 'text-slate-400'} />
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
