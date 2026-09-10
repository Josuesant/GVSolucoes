import { createClient } from '@supabase/supabase-js'

// Quando estiver pronto para integrar com Supabase, configure estas variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para operações comuns
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Funções para Condomínios
export const condominios = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('condominios')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },
  
  getOne: async (id) => {
    const { data, error } = await supabase
      .from('condominios')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },
  
  create: async (condominio) => {
    const { data, error } = await supabase
      .from('condominios')
      .insert([condominio])
      .select()
    return { data, error }
  },
  
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('condominios')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('condominios')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Funções para Funcionários
export const funcionarios = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },
  
  create: async (funcionario) => {
    const { data, error } = await supabase
      .from('funcionarios')
      .insert([funcionario])
      .select()
    return { data, error }
  },
  
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('funcionarios')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  }
}

// Funções para Transações
export const transacoes = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .order('data_lancamento', { ascending: false })
    return { data, error }
  },
  
  create: async (transacao) => {
    const { data, error } = await supabase
      .from('transacoes')
      .insert([transacao])
      .select()
    return { data, error }
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Funções para Lembretes
export const lembretes = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .order('data_referencia', { ascending: true })
    return { data, error }
  },
  
  getPending: async () => {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .eq('resolvido', false)
      .order('data_referencia', { ascending: true })
    return { data, error }
  },
  
  markAsResolved: async (id) => {
    const { data, error } = await supabase
      .from('lembretes')
      .update({ resolvido: true })
      .eq('id', id)
      .select()
    return { data, error }
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('lembretes')
      .delete()
      .eq('id', id)
    return { error }
  }
}
