import { supabase } from '../index.js'

// Get all companies
export const getCompanies = async (req, res) => {
  try {
    const { category, search } = req.query

    let query = supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({
      success: true,
      count: data?.length || 0,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    })
  }
}

// Get single company
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company'
    })
  }
}

// Save/unsave company for user
export const saveCompany = async (req, res) => {
  try {
    const userId = req.user.id
    const { companyId } = req.params
    const { isSaved } = req.body

    // Check if already saved
    const { data: existing } = await supabase
      .from('company_preparation')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .single()

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('company_preparation')
        .update({ is_saved: isSaved ?? !existing.is_saved })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return res.json({ success: true, data })
    }

    // Create new
    const { data, error } = await supabase
      .from('company_preparation')
      .insert([{
        user_id: userId,
        company_id: companyId,
        is_saved: true
      }])
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save company',
      error: error.message
    })
  }
}

// Mark company preparation as complete
export const markComplete = async (req, res) => {
  try {
    const userId = req.user.id
    const { companyId } = req.params
    const { isCompleted, progress } = req.body

    const { data: existing } = await supabase
      .from('company_preparation')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('company_preparation')
        .update({
          is_completed: isCompleted ?? !existing.is_completed,
          progress: progress ?? (isCompleted ? 100 : 0)
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return res.json({ success: true, data })
    }

    const { data, error } = await supabase
      .from('company_preparation')
      .insert([{
        user_id: userId,
        company_id: companyId,
        is_completed: true,
        progress: 100
      }])
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update preparation',
      error: error.message
    })
  }
}

// Get user's saved companies
export const getUserCompanies = async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('company_preparation')
      .select('*, companies(*)),')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      count: data?.length || 0,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved companies'
    })
  }
}
