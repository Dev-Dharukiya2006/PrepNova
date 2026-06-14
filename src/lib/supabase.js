import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })

  if (error) throw error

  if (data.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        email: email,
        full_name: userData.full_name,
        college: userData.college,
        branch: userData.branch,
        year: userData.year,
        theme_preference: 'light'
      }])

    if (insertError) {
      console.error('Error creating user profile:', insertError)
    }

    await supabase.from('user_progress').insert([{
      user_id: data.user.id,
      aptitude_completed: 0,
      aptitude_total: 0,
      dsa_completed: 0,
      dsa_total: 0,
      total_tests: 0,
      weak_topics: [],
      strong_topics: [],
      weekly_progress: {}
    }])
  }

  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()

  if (error) throw error
  return data
}

export const getUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const updateUserProgress = async (userId, progress) => {
  const { data, error } = await supabase
    .from('user_progress')
    .update(progress)
    .eq('user_id', userId)
    .select()

  if (error) throw error
  return data
}

export const getAptitudeTopics = async () => {
  const { data, error } = await supabase
    .from('aptitude_topics')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export const getAptitudeQuestions = async (topicId, difficulty = null) => {
  let query = supabase
    .from('aptitude_questions')
    .select('*')
    .eq('topic_id', topicId)

  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const saveAptitudeResult = async (result) => {
  const { data, error } = await supabase
    .from('aptitude_results')
    .insert([result])
    .select()

  if (error) throw error
  return data
}

export const getAptitudeResults = async (userId) => {
  const { data, error } = await supabase
    .from('aptitude_results')
    .select('*, aptitude_topics(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getDSATopics = async () => {
  const { data, error } = await supabase
    .from('dsa_topics')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export const getDSAQuestions = async (topicId, difficulty = null) => {
  let query = supabase
    .from('dsa_questions')
    .select('*')
    .eq('topic_id', topicId)

  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const saveDSAResult = async (result) => {
  const { data, error } = await supabase
    .from('dsa_results')
    .insert([result])
    .select()

  if (error) throw error
  return data
}

export const getDSAResults = async (userId) => {
  const { data, error } = await supabase
    .from('dsa_results')
    .select('*, dsa_topics(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getCompanies = async (category = null) => {
  let query = supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const getCompany = async (companyId) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()

  if (error) throw error
  return data
}

export const saveCompanyPreparation = async (preparation) => {
  const { data, error } = await supabase
    .from('company_preparation')
    .upsert(preparation, { onConflict: 'user_id,company_id' })
    .select()

  if (error) throw error
  return data
}

export const getUserCompanyPreparation = async (userId) => {
  const { data, error } = await supabase
    .from('company_preparation')
    .select('*, companies(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const searchCompanies = async (searchTerm) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}
