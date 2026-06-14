import { supabase } from '../index.js'

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { full_name, college, branch, year, skills, target_company } = req.body

    const updates = {}
    if (full_name) updates.full_name = full_name
    if (college !== undefined) updates.college = college
    if (branch !== undefined) updates.branch = branch
    if (year !== undefined) updates.year = year ? parseInt(year) : null
    if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())
    if (target_company !== undefined) updates.target_company = target_company
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    })
  }
}

// Get user progress
export const getProgress = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // If no progress record, create one
    if (!data) {
      const { data: newProgress, error: insertError } = await supabase
        .from('user_progress')
        .insert([{
          user_id: userId,
          aptitude_completed: 0,
          aptitude_total: 0,
          dsa_completed: 0,
          dsa_total: 0,
          total_tests: 0
        }])
        .select()
        .single()

      if (insertError) throw insertError
      return res.json({ success: true, data: newProgress })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress'
    })
  }
}

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id

    // Get aptitude results
    const { data: aptResults } = await supabase
      .from('aptitude_results')
      .select('*')
      .eq('user_id', userId)

    // Get DSA results
    const { data: dsaResults } = await supabase
      .from('dsa_results')
      .select('*')
      .eq('user_id', userId)

    // Get saved companies
    const { data: savedCompanies } = await supabase
      .from('company_preparation')
      .select('*, companies(name)')
      .eq('user_id', userId)
      .eq('is_saved', true)

    // Get progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Calculate stats
    const aptCorrect = aptResults?.reduce((sum, r) => sum + (r.correct_answers || 0), 0) || 0
    const aptTotal = aptResults?.reduce((sum, r) => sum + (r.total_questions || 0), 0) || 0

    const dsaCorrect = dsaResults?.reduce((sum, r) => sum + (r.correct_answers || 0), 0) || 0
    const dsaTotal = dsaResults?.reduce((sum, r) => sum + (r.total_questions || 0), 0) || 0

    res.json({
      success: true,
      data: {
        aptitude: {
          testsTaken: aptResults?.length || 0,
          correctAnswers: aptCorrect,
          totalQuestions: aptTotal,
          accuracy: aptTotal > 0 ? Math.round((aptCorrect / aptTotal) * 100) : 0,
          completed: progress?.aptitude_completed || 0,
          total: progress?.aptitude_total || 0
        },
        dsa: {
          testsTaken: dsaResults?.length || 0,
          correctAnswers: dsaCorrect,
          totalQuestions: dsaTotal,
          accuracy: dsaTotal > 0 ? Math.round((dsaCorrect / dsaTotal) * 100) : 0,
          completed: progress?.dsa_completed || 0,
          total: progress?.dsa_total || 0
        },
        companies: {
          saved: savedCompanies?.length || 0,
          completed: savedCompanies?.filter(c => c.is_completed).length || 0
        },
        totalTests: (aptResults?.length || 0) + (dsaResults?.length || 0),
        weakTopics: progress?.weak_topics || [],
        lastActive: progress?.last_active
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    })
  }
}
