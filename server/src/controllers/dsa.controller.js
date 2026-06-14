import { supabase } from '../index.js'

// Get all DSA topics
export const getTopics = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dsa_topics')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) throw error

    res.json({
      success: true,
      count: data?.length || 0,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch DSA topics',
      error: error.message
    })
  }
}

// Get single DSA topic
export const getTopic = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('dsa_topics')
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

// Get questions for a DSA topic
export const getQuestions = async (req, res) => {
  try {
    const { topicId } = req.params
    const { difficulty, limit = 10, random = false } = req.query

    let query = supabase
      .from('dsa_questions')
      .select('id, question, option_a, option_b, option_c, option_d, difficulty, question_type, topic_id')
      .eq('topic_id', topicId)

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) throw error

    let questions = data || []

    if (random && questions.length > 0) {
      questions = shuffleArray(questions)
    }

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

// Submit DSA test
export const submitTest = async (req, res) => {
  try {
    const userId = req.user?.id
    const { topicId, answers, difficulty } = req.body

    if (!topicId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topicId and answers'
      })
    }

    const questionIds = answers.map(a => a.questionId)
    const { data: questions } = await supabase
      .from('dsa_questions')
      .select('id, correct_answer')
      .in('id', questionIds)

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

    if (userId) {
      await supabase
        .from('dsa_results')
        .insert([{
          user_id: userId,
          topic_id: topicId,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          score,
          difficulty
        }])
    }

    res.json({
      success: true,
      data: {
        totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: totalQuestions - correctCount,
        score,
        results,
        passed: score >= 60
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: error.message
    })
  }
}

// Get user's DSA results
export const getUserResults = async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('dsa_results')
      .select('*, dsa_topics(name)')
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

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
