import { Router } from 'express'
import { supabase } from '../index.js'
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js'

const router = Router()

// All admin routes require authentication and admin role
router.use(authenticateToken)
router.use(isAdmin)

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, college, branch, year, role, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, count: data?.length || 0, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' })
  }
})

// Aptitude Questions Management
router.get('/aptitude/questions', async (req, res) => {
  try {
    const { topicId } = req.query

    let query = supabase
      .from('aptitude_questions')
      .select('*, aptitude_topics(name)')
      .order('created_at', { ascending: false })

    if (topicId) {
      query = query.eq('topic_id', topicId)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({ success: true, count: data?.length || 0, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch questions' })
  }
})

router.post('/aptitude/questions', async (req, res) => {
  try {
    const { topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation } = req.body

    if (!topic_id || !question || !correct_answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topic_id, question, and correct_answer'
      })
    }

    const { data, error } = await supabase
      .from('aptitude_questions')
      .insert([{
        topic_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer: correct_answer.toUpperCase(),
        difficulty: difficulty || 'medium',
        explanation
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, message: 'Question created', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create question', error: error.message })
  }
})

router.put('/aptitude/questions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    if (updates.correct_answer) {
      updates.correct_answer = updates.correct_answer.toUpperCase()
    }

    const { data, error } = await supabase
      .from('aptitude_questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, message: 'Question updated', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update question' })
  }
})

router.delete('/aptitude/questions/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('aptitude_questions')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Question deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete question' })
  }
})

// DSA Questions Management
router.get('/dsa/questions', async (req, res) => {
  try {
    const { topicId } = req.query

    let query = supabase
      .from('dsa_questions')
      .select('*, dsa_topics(name)')
      .order('created_at', { ascending: false })

    if (topicId) {
      query = query.eq('topic_id', topicId)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({ success: true, count: data?.length || 0, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch DSA questions' })
  }
})

router.post('/dsa/questions', async (req, res) => {
  try {
    const { topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, question_type } = req.body

    const { data, error } = await supabase
      .from('dsa_questions')
      .insert([{
        topic_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer: correct_answer?.toUpperCase(),
        difficulty: difficulty || 'medium',
        explanation,
        question_type: question_type || 'mcq'
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, message: 'DSA question created', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create DSA question', error: error.message })
  }
})

router.delete('/dsa/questions/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('dsa_questions')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'DSA question deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete DSA question' })
  }
})

// Companies Management
router.post('/companies', async (req, res) => {
  try {
    const { name, category, overview, hiring_process, aptitude_topics, dsa_topics, interview_questions, preparation_tips, salary_range } = req.body

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and category'
      })
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([{
        name,
        category,
        overview,
        hiring_process,
        aptitude_topics,
        dsa_topics,
        interview_questions,
        preparation_tips,
        salary_range
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, message: 'Company created', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create company', error: error.message })
  }
})

router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, message: 'Company updated', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update company' })
  }
})

router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Company deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete company' })
  }
})

// Topics Management
router.post('/aptitude/topics', async (req, res) => {
  try {
    const { name, category, description, formulas, tricks } = req.body

    const { data, error } = await supabase
      .from('aptitude_topics')
      .insert([{
        name,
        category,
        description,
        formulas,
        tricks
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, message: 'Topic created', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create topic', error: error.message })
  }
})

router.post('/dsa/topics', async (req, res) => {
  try {
    const { name, description, definition, example, code_snippet, time_complexity, space_complexity } = req.body

    const { data, error } = await supabase
      .from('dsa_topics')
      .insert([{
        name,
        description,
        definition,
        example,
        code_snippet,
        time_complexity,
        space_complexity
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, message: 'DSA topic created', data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create DSA topic', error: error.message })
  }
})

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [users, aptQuestions, dsaQuestions, companies] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('aptitude_questions').select('id', { count: 'exact', head: true }),
      supabase.from('dsa_questions').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true })
    ])

    res.json({
      success: true,
      data: {
        totalUsers: users.count || 0,
        aptitudeQuestions: aptQuestions.count || 0,
        dsaQuestions: dsaQuestions.count || 0,
        totalCompanies: companies.count || 0
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' })
  }
})

export default router
