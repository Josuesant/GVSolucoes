import { useState } from 'react'
import { Plus, Edit2, Trash2, Power } from 'lucide-react'

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, nome: 'João Silva', cpf: '123.456.789-00', salario_bruto: 3000, salario_liquido: 2400, beneficios: 300, ativo: true },
    { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00', salario_bruto: 2800, salario_liquido: 2240, beneficios: 200, ativo: true },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ nome: '', cpf: '', salario_bruto: '', salario_liquido: '', beneficios: '' })

  const handleSave = () => {
    if (editingId) {
      setFuncionarios(funcionarios.map(f => f.id === editingId ? { ...formData, id: editingId, ativo: true } : f))
      setEditingId(null)
    } else {
      setFuncionarios([...funcionarios, { ...formData, id: Date.now(), ativo: true }])
    }
    setFormData({ nome: '', cpf: '', salario_bruto: '', salario_liquido: '', beneficios: '' })
    setShowForm(false)
  }

  const handleEdit = (funcionario) => {
    setFormData(funcionario)
    setEditingId(funcionario.id)
    setShowForm(true)
  }

  const toggleAtivo = (id) => {
    setFuncionarios(funcionarios.map(f => f.id === id ? { ...f, ativo: !f.ativo } : f))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Funcionários</h2>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nome: '', cpf: '', salario_bruto: '', salario_liquido: '', beneficios: '' }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Funcionário
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Editar' : 'Novo'} Funcionário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome"
              className="input"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <input
              type="text"
              placeholder="CPF"
              className="input"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            />
            <input
              type="number"
              placeholder="Salário Bruto"
              className="input"
              value={formData.salario_bruto}
              onChange={(e) => setFormData({ ...formData, salario_bruto: e.target.value })}
            />
            <input
              type="number"
              placeholder="Salário Líquido"
              className="input"
              value={formData.salario_liquido}
              onChange={(e) => setFormData({ ...formData, salario_liquido: e.target.value })}
            />
            <input
              type="number"
              placeholder="Benefícios"
              className="input"
              value={formData.beneficios}
              onChange={(e) => setFormData({ ...formData, beneficios: e.target.value })}
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">CPF</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Salário Bruto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Salário Líquido</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{funcionario.nome}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{funcionario.cpf}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">R$ {funcionario.salario_bruto.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white">R$ {funcionario.salario_liquido.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${funcionario.ativo ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300'}`}>
                    {funcionario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(funcionario)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button onClick={() => toggleAtivo(funcionario.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <Power size={16} className={funcionario.ativo ? 'text-green-600' : 'text-slate-400'} />
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
