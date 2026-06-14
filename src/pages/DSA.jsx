import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineBookOpen, HiOutlineClock, HiOutlineChip, HiArrowRight, HiOutlineCode } from 'react-icons/hi'
import { getDSATopics } from '../lib/supabase'
import { useTheme } from '../contexts/ThemeContext'

const topicColors = [
  'linear-gradient(135deg, #8B5CF6, #4F46E5)',
  'linear-gradient(135deg, #3B82F6, #06B6D4)',
  'linear-gradient(135deg, #06B6D4, #14B8A6)',
  'linear-gradient(135deg, #EC4899, #8B5CF6)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #6D28D9, #EC4899)',
  'linear-gradient(135deg, #0E7490, #10B981)',
]

const DSA = () => {
  const { darkMode } = useTheme()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDSATopics().then(setTopics).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-aurora-purple border-t-transparent" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.15))', border: '1px solid rgba(139,92,246,0.25)' }}>
        {darkMode && (
          <div className="aurora-orb w-80 h-80 -top-20 -right-20"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }} />
        )}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
              <HiOutlineCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-dark-900'}`}>
                DSA Coding Practice
              </h1>
              <p className={`text-sm ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
                Learn concepts, see examples, then solve real coding problems
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { icon: HiOutlineBookOpen, text: `${topics.length} Topics` },
              { icon: HiOutlineClock, text: 'Learn at your pace' },
              { icon: HiOutlineChip, text: 'In-browser Python execution' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <Icon className="w-4 h-4 text-aurora-purple" />
                <span className={`text-sm font-medium ${darkMode ? 'text-dark-200' : 'text-dark-700'}`}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { step: '1', title: 'Learn the Concept', desc: 'Read detailed explanations with visual examples and step-by-step walkthroughs' },
          { step: '2', title: 'Study Code Examples', desc: 'See real Python implementations with explanations of the logic and approach' },
          { step: '3', title: 'Solve & Submit', desc: 'Write your own solution in the editor, run it against test cases, see pass/fail' },
        ].map(({ step, title, desc }) => (
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: parseInt(step) * 0.1 }}
            className="card-aurora p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
              {step}
            </div>
            <div>
              <div className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-dark-900'}`}>{title}</div>
              <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>{desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((topic, i) => (
          <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-aurora group hover:shadow-aurora transition-all duration-300 overflow-hidden">
            <div className="h-2 w-full" style={{ background: topicColors[i % topicColors.length] }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: topicColors[i % topicColors.length] }}>
                  <HiOutlineCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: darkMode ? 'rgba(139,92,246,0.15)' : '#f5f3ff', color: '#8B5CF6' }}>
                  #{i + 1}
                </span>
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark-900'}`}>{topic.name}</h3>
              <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>
                {topic.description || topic.definition}
              </p>
              {topic.time_complexity && (
                <div className="flex items-center gap-1.5 mb-4 text-xs"
                  style={{ color: darkMode ? '#6683e8' : '#4a5fa8' }}>
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  <span>{topic.time_complexity?.split(',')[0]?.trim()}</span>
                </div>
              )}
              <Link to={`/dsa/topic/${topic.id}`}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-semibold text-sm transition-all group-hover:shadow-aurora"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(139,92,246,0.25)', color: darkMode ? '#a78bfa' : '#7c3aed' }}>
                <span>Learn & Practice</span>
                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DSA
