import { supabase } from '../index.js'

// Get all aptitude topics
export const getTopics = async (req, res) => {
  try {
    const { category } = req.query

    let query = supabase
      .from('aptitude_topics')
      .select('*')
      .order('order_index', { ascending: true })

    if (category) {
      query = query.eq('category', category)
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
      message: 'Failed to fetch topics',
      error: error.message
    })
  }
}

// Get single topic
export const getTopic = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('aptitude_topics')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic'
    })
  }
}

// Get questions for a topic
export const getQuestions = async (req, res) => {
  try {
    const { topicId } = req.params
    const { difficulty, limit = 10, random = false } = req.query

    let query = supabase
      .from('aptitude_questions')
      .select('id, question, option_a, option_b, option_c, option_d, difficulty, topic_id')
      .eq('topic_id', topicId)

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) throw error

    let questions = data || []

    // Random shuffle if requested
    if (random && questions.length > 0) {
      questions = shuffleArray(questions)
    }

    // Limit results
    if (limit) {
      questions = questions.slice(0, parseInt(limit))
    }

    res.json({
      success: true,
      count: questions.length,
      data: questions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    })
  }
}

// Get single question with answer (for review)
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('aptitude_questions')
      .select('*, aptitude_topics(name)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question'
    })
  }
}

// Submit test and get results
export const submitTest = async (req, res) => {
  try {
    const userId = req.user?.id
    const { topicId, answers, difficulty, timeTaken } = req.body

    if (!topicId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topicId and answers array'
      })
    }

    // Get correct answers
    const questionIds = answers.map(a => a.questionId)
    const { data: questions, error } = await supabase
      .from('aptitude_questions')
      .select('id, correct_answer')
      .in('id', questionIds)

    if (error) throw error

    // Calculate score
    let correctCount = 0
    const results = answers.map(answer => {
      const question = questions?.find(q => q.id === answer.questionId)
      const isCorrect = question && question.correct_answer === answer.selectedAnswer
      if (isCorrect) correctCount++
      return {
        questionId: answer.questionId,
        selected: answer.selectedAnswer,
        correct: question?.correct_answer,
        isCorrect
      }
    })

    const totalQuestions = answers.length
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

    // Save result if user is logged in
    if (userId) {
      await supabase
        .from('aptitude_results')
        .insert([{
          user_id: userId,
          topic_id: topicId,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          score,
          difficulty,
          time_taken: timeTaken
        }])

      // Update user progress
      await updateUserProgress(userId)
    }

    res.json({
      success: true,
      data: {
        totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: totalQuestions - correctCount,
        score,
        accuracy: score,
        results,
        passed: score >= 60
      }
    })
  } catch (error) {
    console.error('Submit test error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: error.message
    })
  }
}

// Get user's aptitude results
export const getUserResults = async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('aptitude_results')
      .select('*, aptitude_topics(name, category)')
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
      message: 'Failed to fetch results'
    })
  }
}

// Helper: Shuffle array
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Helper: Update user progress
async function updateUserProgress(userId) {
  try {
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

    const totalTests = (aptResults?.length || 0) + (dsaResults?.length || 0)

    // Calculate weak topics
    const weakTopics = []
    // ... logic to identify weak topics

    await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        total_tests: totalTests,
        weak_topics: weakTopics,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
  } catch (error) {
    console.error('Error updating progress:', error)
  }
}
