import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ========== AUTENTICAÇÃO ==========

export const authFunctions = {
  // Registrar novo usuário
  async signup(email, password, name) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Adicionar dados do usuário na tabela usuarios
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: data.user.id,
            email,
            name,
            ativo: true
          }
        ])

      if (insertError) throw insertError

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Fazer login
  async signin(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Buscar dados do usuário
      const { data: user, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userError) throw userError

      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Fazer logout
  async signout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      if (!user) return null

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      return userData
    } catch (error) {
      return null
    }
  }
}

// ========== CONDOMINIOS ==========

export const condominioFunctions = {
  // Listar condominios do usuário
  async list(userId) {
    const { data, error } = await supabase
      .from('condominios')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Obter condominio específico
  async getById(id) {
    const { data, error } = await supabase
      .from('condominios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar condominio
  async create(userId, condominioData) {
    const { data, error } = await supabase
      .from('condominios')
      .insert([
        {
          usuario_id: userId,
          ...condominioData
        }
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Atualizar condominio
  async update(id, condominioData) {
    const { data, error } = await supabase
      .from('condominios')
      .update(condominioData)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deletar condominio
  async delete(id) {
    const { error } = await supabase
      .from('condominios')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// ========== FUNCIONARIOS ==========

export const funcionarioFunctions = {
  // Listar funcionarios do usuário
  async list(userId) {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Listar funcionarios de um condominio
  async listByCondominio(condominioId) {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*, funcionarios(*)')
      .eq('condominio_id', condominioId)
      .eq('tipo', 'despesa')
      .eq('categoria', 'Salário')

    if (error) throw error
    return data
  },

  // Criar funcionario
  async create(userId, funcionarioData) {
    const { data, error } = await supabase
      .from('funcionarios')
      .insert([
        {
          usuario_id: userId,
          ...funcionarioData
        }
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Atualizar funcionario
  async update(id, funcionarioData) {
    const { data, error } = await supabase
      .from('funcionarios')
      .update(funcionarioData)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deletar funcionario
  async delete(id) {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// ========== TRANSACOES ==========

export const transacaoFunctions = {
  // Listar transacoes do usuário
  async list(userId) {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .eq('usuario_id', userId)
      .order('data_lancamento', { ascending: false })

    if (error) throw error
    return data
  },

  // Listar transacoes de um condominio
  async listByCondominio(condominioId) {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .eq('condominio_id', condominioId)
      .order('data_lancamento', { ascending: false })

    if (error) throw error
    return data
  },

  // Obter total de receitas e despesas por condominio
  async getResumoPorCondominio(condominioId) {
    const { data, error } = await supabase
      .from('transacoes')
      .select('tipo, valor')
      .eq('condominio_id', condominioId)

    if (error) throw error

    const resumo = {
      receitas: 0,
      despesas: 0
    }

    data.forEach(t => {
      if (t.tipo === 'receita') {
        resumo.receitas += t.valor
      } else {
        resumo.despesas += t.valor
      }
    })

    resumo.lucro = resumo.receitas - resumo.despesas

    return resumo
  },

  // Criar transacao
  async create(userId, transacaoData) {
    const { data, error } = await supabase
      .from('transacoes')
      .insert([
        {
          usuario_id: userId,
          ...transacaoData
        }
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Atualizar transacao
  async update(id, transacaoData) {
    const { data, error } = await supabase
      .from('transacoes')
      .update(transacaoData)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deletar transacao
  async delete(id) {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// ========== LEMBRETES ==========

export const lembreteFunctions = {
  // Listar lembretes do usuário
  async list(userId) {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .eq('usuario_id', userId)
      .eq('resolvido', false)
      .order('data_referencia', { ascending: true })

    if (error) throw error
    return data
  },

  // Listar lembretes de um condominio
  async listByCondominio(condominioId) {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .eq('condominio_id', condominioId)
      .order('data_referencia', { ascending: true })

    if (error) throw error
    return data
  },

  // Criar lembrete
  async create(userId, condominioId, lembretData) {
    const { data, error } = await supabase
      .from('lembretes')
      .insert([
        {
          usuario_id: userId,
          condominio_id: condominioId,
          ...lembretData
        }
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Atualizar lembrete
  async update(id, lembretData) {
    const { data, error } = await supabase
      .from('lembretes')
      .update(lembretData)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Deletar lembrete
  async delete(id) {
    const { error } = await supabase
      .from('lembretes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

export default supabase
