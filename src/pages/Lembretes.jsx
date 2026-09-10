import { useState } from 'react'
import { CheckCircle, AlertCircle, Trash2 } from 'lucide-react'

export default function Lembretes() {
  const [lembretes, setLembretes] = useState([
    { id: 1, titulo: 'Renovação - Condomínio A', data: '2024-10-15', resolvido: false, condominio: 'Condomínio A' },
    { id: 2, titulo: 'Renovação - Condomínio B', data: '2024-11-20', resolvido: false, condominio: 'Condomínio B' },
    { id: 3, titulo: 'Renovação - Condomínio C', data: '2024-12-10', resolvido: true, condominio: 'Condomínio C' },
    { id: 4, titulo: 'Renovação - Condomínio D', data: '2024-08-30', resolvido: true, condominio: 'Condomínio D' },
  ])

  const toggleResolvido = (id) => {
    setLembretes(lembretes.map(l => l.id === id ? { ...l, resolvido: !l.resolvido } : l))
  }

  const handleDelete = (id) => {
    setLembretes(lembretes.filter(l => l.id !== id))
  }

  const pendentes = lembretes.filter(l => !l.resolvido)
  const resolvidos = lembretes.filter(l => l.resolvido)

  const formatData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lembretes de Renovação</h2>
        <p className="text-slate-600 dark:text-slate-400">Controle dos próximos aniversários de contratos</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 border-l-4 border-amber-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pendentes</p>
          <p className="text-3xl font-bold text-amber-600">{pendentes.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Resolvidos</p>
          <p className="text-3xl font-bold text-green-600">{resolvidos.length}</p>
        </div>
      </div>

      {/* Lembretes Pendentes */}
      {pendentes.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="text-amber-600" size={20} />
            Renovações Pendentes ({pendentes.length})
          </h3>
          <div className="space-y-3">
            {pendentes.map((lembrete) => (
              <div key={lembrete.id} className="card p-4 border-l-4 border-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">{lembrete.titulo}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{lembrete.condominio}</p>
                    <p className="text-sm text-amber-600 font-medium mt-2">📅 {formatData(lembrete.data)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleResolvido(lembrete.id)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      title="Marcar como resolvido"
                    >
                      <CheckCircle size={20} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(lembrete.id)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      title="Deletar"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lembretes Resolvidos */}
      {resolvidos.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Renovações Resolvidas ({resolvidos.length})
          </h3>
          <div className="space-y-3">
            {resolvidos.map((lembrete) => (
              <div key={lembrete.id} className="card p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white line-through opacity-70">{lembrete.titulo}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{lembrete.condominio}</p>
                    <p className="text-sm text-green-600 font-medium mt-2">✓ {formatData(lembrete.data)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(lembrete.id)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    title="Deletar"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lembretes.length === 0 && (
        <div className="card p-12 text-center">
          <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
          <p className="text-lg font-medium text-slate-900 dark:text-white">Nenhum lembrete</p>
          <p className="text-slate-600 dark:text-slate-400">Todos os contratos estão em dia!</p>
        </div>
      )}
    </div>
  )
}
