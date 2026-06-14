import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowRight,
  HiOutlineCalculator,
  HiOutlineLightBulb,
  HiOutlineDocumentText,
  HiOutlinePlay,
  HiOutlineBookOpen
} from 'react-icons/hi'
import { getAptitudeTopics, getAptitudeQuestions } from '../lib/supabase'

const AptitudeTopic = () => {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsData = await getAptitudeTopics()
        const foundTopic = topicsData?.find(t => t.id === parseInt(topicId))
        setTopic(foundTopic)

        if (foundTopic) {
          const questionsData = await getAptitudeQuestions(foundTopic.id)
          setQuestions(questionsData || [])
        }
      } catch (error) {
        console.error('Error fetching topic data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [topicId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-600 dark:text-dark-400">Topic not found</p>
        <Link to="/aptitude" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to Aptitude
        </Link>
      </div>
    )
  }

  const categoryIcons = {
    quantitative: HiOutlineCalculator,
    logical: HiOutlineLightBulb,
    verbal: HiOutlineDocumentText
  }

  const categoryColors = {
    quantitative: 'from-blue-500 to-cyan-500',
    logical: 'from-green-500 to-emerald-500',
    verbal: 'from-orange-500 to-red-500'
  }

  const Icon = categoryIcons[topic.category] || HiOutlineBookOpen
  const color = categoryColors[topic.category] || 'from-gray-500 to-gray-600'

  const difficultyCount = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${color} rounded-2xl p-6 md:p-8 text-white`}
      >
        <Link
          to="/aptitude"
          className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
        >
          ← Back to Topics
        </Link>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/20">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-sm uppercase tracking-wider text-white/80 capitalize">
              {topic.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold">{topic.name}</h1>
          </div>
        </div>
      </motion.div>

      {/* Topic Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              About this Topic
            </h2>
            <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
              {topic.description || `${topic.name} is an important topic in ${topic.category} aptitude tests. Mastering this topic will help you solve problems efficiently during placement tests and competitive exams.`}
            </p>
          </motion.div>

          {/* Formulas */}
          {topic.formulas && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Key Formulas
              </h2>
              <div className="bg-dark-50 dark:bg-dark-900 rounded-lg p-4 font-mono text-sm text-dark-800 dark:text-dark-200 whitespace-pre-wrap">
                {topic.formulas}
              </div>
            </motion.div>
          )}

          {/* Tips & Tricks */}
          {topic.tricks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Tips & Tricks
              </h2>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-dark-700 dark:text-dark-300">
                {topic.tricks}
              </div>
            </motion.div>
          )}

          {/* Sample Questions Preview */}
          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Sample Questions
              </h2>
              <div className="space-y-4">
                {questions.slice(0, 3).map((q, index) => (
                  <div
                    key={q.id}
                    className="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-dark-800 dark:text-dark-200 mb-2">
                          {q.question}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          q.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Start Test Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Take a Test
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              Test your knowledge with {questions.length} available questions.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-600 dark:text-dark-400">Easy</span>
                <span className="font-medium text-green-600">{difficultyCount.easy}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-600 dark:text-dark-400">Medium</span>
                <span className="font-medium text-yellow-600">{difficultyCount.medium}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-600 dark:text-dark-400">Hard</span>
                <span className="font-medium text-red-600">{difficultyCount.hard}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to={`/aptitude/test/${topic.id}?difficulty=easy`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <HiOutlinePlay className="w-5 h-5" />
                Easy Test
              </Link>
              <Link
                to={`/aptitude/test/${topic.id}?difficulty=medium`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                <HiOutlinePlay className="w-5 h-5" />
                Medium Test
              </Link>
              <Link
                to={`/aptitude/test/${topic.id}?difficulty=hard`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <HiOutlinePlay className="w-5 h-5" />
                Hard Test
              </Link>
              <Link
                to={`/aptitude/test/${topic.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 btn-primary"
              >
                All Questions
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-600 dark:text-dark-400">Total Questions</span>
                <span className="font-semibold text-dark-900 dark:text-white">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-600 dark:text-dark-400">Category</span>
                <span className="font-semibold text-dark-900 dark:text-white capitalize">{topic.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AptitudeTopic
