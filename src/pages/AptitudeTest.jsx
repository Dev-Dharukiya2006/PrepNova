import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineClock,
  HiCheck,
  HiOutlineX,
  HiOutlineRefresh,
  HiArrowRight
} from 'react-icons/hi'
import { getAptitudeTopics, getAptitudeQuestions, saveAptitudeResult } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const AptitudeTest = () => {
  const { topicId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, refreshProgress } = useAuth()

  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const difficulty = searchParams.get('difficulty')
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsData = await getAptitudeTopics()
        const foundTopic = topicsData?.find(t => t.id === parseInt(topicId))
        setTopic(foundTopic)

        if (foundTopic) {
          let questionsData = await getAptitudeQuestions(foundTopic.id, difficulty)
          // Shuffle questions and limit to 10
          questionsData = shuffleArray(questionsData || []).slice(0, 10)
          setQuestions(questionsData)

          // Set timer based on difficulty
          const timePerQuestion = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
          setTimeLeft(questionsData.length * timePerQuestion)
        }
      } catch (error) {
        console.error('Error fetching test data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [topicId, difficulty])

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerActive(false)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, timeLeft])

  useEffect(() => {
    if (questions.length > 0 && !showResult) {
      setIsTimerActive(true)
    }
  }, [questions, showResult])

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswer = (answer) => {
    if (showResult) return
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: answer
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (submitting || showResult) return
    setSubmitting(true)
    setIsTimerActive(false)

    // Calculate results
    let correctAnswers = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correctAnswers++
      }
    })

    // Save result to database
    if (user && topic) {
      try {
        await saveAptitudeResult({
          user_id: user.id,
          topic_id: topic.id,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          score: (correctAnswers / questions.length) * 100,
          difficulty: difficulty || 'mixed',
          time_taken: (questions.length * (difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120)) - timeLeft
        })
        await refreshProgress()
      } catch (error) {
        console.error('Error saving result:', error)
        toast.error('Failed to save result')
      }
    }

    setShowResult(true)
    setSubmitting(false)
  }, [submitting, showResult, user, topic, questions, answers, difficulty, timeLeft, refreshProgress])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!topic || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-600 dark:text-dark-400">No questions available for this test.</p>
        <Link to={`/aptitude/topic/${topicId}`} className="text-primary-600 hover:underline mt-2 inline-block">
          Back to Topic
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const selectedAnswer = answers[currentIndex]

  // Result screen
  if (showResult) {
    let correctAnswers = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) correctAnswers++
    })

    const accuracy = Math.round((correctAnswers / questions.length) * 100)
    const passed = accuracy >= 60

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="card p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {passed ? (
              <HiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <HiOutlineX className="w-10 h-10 text-red-600 dark:text-red-400" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mb-8">
            {passed
              ? 'You have successfully completed this test.'
              : 'Review your mistakes and try again.'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">{correctAnswers}</div>
              <div className="text-sm text-dark-500">Correct</div>
            </div>
            <div className="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
              <div className="text-3xl font-bold text-dark-600">
                {questions.length - correctAnswers}
              </div>
              <div className="text-sm text-dark-500">Wrong</div>
            </div>
            <div className="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {accuracy}%
              </div>
              <div className="text-sm text-dark-500">Accuracy</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 text-left">
              Review Answers
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {questions.map((q, index) => {
                const isCorrect = answers[index] === q.correct_answer
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg text-left ${
                      isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'
                      }`}>
                        {isCorrect ? (
                          <HiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <HiOutlineX className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-dark-800 dark:text-dark-200 mb-1">{q.question}</p>
                        <p className="text-xs">
                          <span className="text-dark-500">Your answer: </span>
                          <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {answers[index] ? `Option ${answers[index]}` : 'Not answered'}
                          </span>
                          {!isCorrect && (
                            <>
                              <span className="text-dark-500 ml-2">| Correct: </span>
                              <span className="text-green-600">Option {q.correct_answer}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to={`/aptitude/topic/${topicId}`}
              className="btn-secondary"
            >
              Back to Topic
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex items-center gap-2"
            >
              <HiOutlineRefresh className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-dark-900 dark:text-white">
              {topic.name}
              {difficulty && (
                <span className={`ml-2 text-sm px-2 py-1 rounded ${
                  difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {difficulty}
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
              <HiOutlineClock className="w-5 h-5" />
              <span className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-dark-600 dark:text-dark-400 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Question Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {['A', 'B', 'C', 'D'].map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                selectedAnswer === option
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
              }`}>
                {option}
              </span>
              <span className="text-dark-800 dark:text-dark-200">
                {currentQuestion[`option_${option.toLowerCase()}`]}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`btn-secondary ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-primary-500'
                  : answers[index]
                    ? 'bg-primary-300 dark:bg-primary-700'
                    : 'bg-dark-200 dark:bg-dark-700'
              }`}
            />
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Submit Test
                <HiArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            Next
            <HiArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AptitudeTest
