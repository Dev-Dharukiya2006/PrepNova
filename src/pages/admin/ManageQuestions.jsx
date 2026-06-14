import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAptitudeTopics, getDSATopics, getAptitudeQuestions, getDSAQuestions } from '../../lib/supabase'
import {
  HiOutlineDocumentText,
  HiOutlineCode,
  HiPlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch
} from 'react-icons/hi'
import toast from 'react-hot-toast'

const ManageQuestions = () => {
  const [activeType, setActiveType] = useState('aptitude')
  const [topics, setTopics] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeType])

  useEffect(() => {
    if (selectedTopic) {
      fetchQuestions()
    }
  }, [selectedTopic, activeType])

  const fetchData = async () => {
    setLoading(true)
    try {
      const topicsData = activeType === 'aptitude'
        ? await getAptitudeTopics()
        : await getDSATopics()
      setTopics(topicsData || [])
      if (topicsData && topicsData.length > 0) {
        setSelectedTopic(topicsData[0].id.toString())
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async () => {
    try {
      const questionsData = activeType === 'aptitude'
        ? await getAptitudeQuestions(parseInt(selectedTopic))
        : await getDSAQuestions(parseInt(selectedTopic))
      setQuestions(questionsData || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return

    toast.success('Question deleted successfully')
    fetchQuestions()
  }

  return (
    <div className="space-y-6">
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveType('aptitude')
            setSelectedTopic('')
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeType === 'aptitude'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300'
          }`}
        >
          <HiOutlineDocumentText className="w-5 h-5" />
          Aptitude
        </button>
        <button
          onClick={() => {
            setActiveType('dsa')
            setSelectedTopic('')
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeType === 'dsa'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300'
          }`}
        >
          <HiOutlineCode className="w-5 h-5" />
          DSA
        </button>
      </div>

      {/* Topic Select & Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="input-field flex-1"
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-dark-800 dark:text-dark-200 mb-2">
                    {question.question || question.question_text}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400">
                      Correct: {question.correct_answer}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.error('Edit functionality coming soon')}
                    className="p-2 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-dark-600 dark:text-dark-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <HiOutlineDocumentText className="w-12 h-12 mx-auto mb-4 text-dark-400" />
          <p className="text-dark-600 dark:text-dark-400">
            {selectedTopic ? 'No questions found for this topic.' : 'Select a topic to view questions.'}
          </p>
        </div>
      )}

      {/* Add Question Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-lg w-full mx-4"
          >
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Add New Question
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Question management features are coming soon. This is a placeholder modal.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ManageQuestions
