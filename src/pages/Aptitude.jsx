import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineChartBar, HiArrowRight,
  HiOutlineCalculator, HiOutlineLightBulb, HiOutlineDocumentText
} from 'react-icons/hi'
import { getAptitudeTopics, getAptitudeResults } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const categoryConfig = {
  quantitative: {
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.3)',
    label: 'Quantitative',
    icon: HiOutlineCalculator
  },
  logical: {
    gradient: 'linear-gradient(135deg, #8B5CF6, #4F46E5)',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.3)',
    label: 'Logical',
    icon: HiOutlineLightBulb
  },
  verbal: {
    gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    bg: 'rgba(236,72,153,0.1)',
    border: 'rgba(236,72,153,0.3)',
    label: 'Verbal',
    icon: HiOutlineDocumentText
  }
}

const Aptitude = () => {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsData, resultsData] = await Promise.all([
          getAptitudeTopics(),
          user ? getAptitudeResults(user.id) : Promise.resolve([])
        ])
        setTopics(topicsData || [])
        setResults(resultsData || [])
      } catch (error) {
        console.error('Error fetching aptitude data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'quantitative', label: 'Quantitative' },
    { id: 'logical', label: 'Logical Reasoning' },
    { id: 'verbal', label: 'Verbal Ability' }
  ]

  const filteredTopics = selectedCategory === 'all'
    ? topics
    : topics.filter(t => t.category === selectedCategory)

  const getTopicProgress = (topicId) => {
    const topicResults = results.filter(r => r.topic_id === topicId)
    if (!topicResults.length) return null
    const latest = topicResults[0]
    return {
      accuracy: latest.total_questions > 0
        ? Math.round((latest.correct_answers / latest.total_questions) * 100) : 0,
      attempts: topicResults.length
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full animate-spin"
          style={{ border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8B5CF6' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Aurora Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="aurora-banner rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="aurora-orb w-64 h-64 -top-16 -right-16 opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <HiOutlineChartBar className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Aptitude Preparation</h1>
          </div>
          <p className="text-white/80 max-w-lg">
            Master quantitative, logical reasoning, and verbal ability to ace your placement tests. Each topic includes easy, medium, and hard questions.
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">{topics.length} Topics</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">{results.length} Tests Taken</span>
          </div>
        </div>
      </motion.div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            style={selectedCategory === cat.id ? {
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(139,92,246,0.4)'
            } : {
              background: 'transparent',
              border: '1px solid rgba(139,92,246,0.25)',
              color: 'inherit'
            }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic, index) => {
          const progress = getTopicProgress(topic.id)
          const config = categoryConfig[topic.category] || categoryConfig.quantitative

          return (
            <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}>
              <Link to={`/aptitude/topic/${topic.id}`} className="block card-aurora p-5 h-full group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: config.gradient }}>
                    <HiOutlineChartBar className="w-5 h-5 text-white" />
                  </div>
                  {progress ? (
                    <span className="text-xs font-bold px-2 py-1 rounded-lg"
                      style={{
                        background: progress.accuracy >= 70 ? 'rgba(16,185,129,0.15)' :
                          progress.accuracy >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: progress.accuracy >= 70 ? '#10b981' :
                          progress.accuracy >= 40 ? '#f59e0b' : '#ef4444'
                      }}>
                      {progress.accuracy}%
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-lg badge-aurora">New</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-dark-900 dark:text-white mb-2 group-hover:text-aurora-purple transition-colors">
                  {topic.name}
                </h3>

                <p className="text-xs text-dark-500 dark:text-dark-400 line-clamp-2 mb-4 leading-relaxed">
                  {topic.description || `Practice ${topic.name.toLowerCase()} problems with difficulty levels.`}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md capitalize"
                    style={{ background: config.bg, color: 'inherit', border: `1px solid ${config.border}` }}>
                    {topic.category}
                  </span>
                  <span className="text-xs text-dark-400 dark:text-dark-500 flex items-center gap-1">
                    {progress ? `${progress.attempts} attempt${progress.attempts > 1 ? 's' : ''}` : 'Start'}
                    <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.1)' }}>
            <HiOutlineChartBar className="w-8 h-8" style={{ color: '#8B5CF6' }} />
          </div>
          <p className="text-dark-500">No topics found for this category.</p>
        </div>
      )}
    </div>
  )
}

export default Aptitude
