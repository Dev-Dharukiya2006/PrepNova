import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import {
  HiOutlineChartBar, HiOutlineBookOpen, HiOfficeBuilding,
  HiArrowRight, HiOutlineLightBulb, HiOutlineMoon, HiOutlineSun, HiCheck
} from 'react-icons/hi'
import Logo from '../components/Logo'

const features = [
  {
    icon: HiOutlineChartBar,
    title: 'Aptitude Mastery',
    description: 'Master quantitative, logical reasoning, and verbal ability with 500+ practice questions across easy, medium, and hard difficulty levels.',
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    glow: 'rgba(59,130,246,0.3)'
  },
  {
    icon: HiOutlineBookOpen,
    title: 'DSA Excellence',
    description: 'Learn data structures and algorithms with rich explanations, code examples, time/space complexity analysis, and graded problem sets.',
    gradient: 'linear-gradient(135deg, #8B5CF6, #4F46E5)',
    glow: 'rgba(139,92,246,0.3)'
  },
  {
    icon: HiOfficeBuilding,
    title: 'Company Prep',
    description: 'Prepare for 50+ companies with tailored roadmaps, real interview questions, hiring process details, and salary insights.',
    gradient: 'linear-gradient(135deg, #06B6D4, #14B8A6)',
    glow: 'rgba(6,182,212,0.3)'
  }
]

const stats = [
  { value: '50+', label: 'Companies' },
  { value: '500+', label: 'Questions' },
  { value: '38+', label: 'Topics' },
  { value: '3', label: 'Difficulty Levels' }
]

const Home = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: darkMode ? '#080d1a' : '#f0f4ff' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: darkMode ? 'rgba(8,13,26,0.85)' : 'rgba(240,244,255,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(139,92,246,0.15)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-xl font-extrabold aurora-text">PrepNova</span>
            </Link>

            <div className="flex items-center space-x-3">
              <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors"
                style={{ background: darkMode ? 'rgba(139,92,246,0.1)' : '#f5f3ff' }}>
                {darkMode
                  ? <HiOutlineSun className="w-5 h-5 text-yellow-400" />
                  : <HiOutlineMoon className="w-5 h-5" style={{ color: '#8B5CF6' }} />}
              </button>
              <Link to="/login" className={`px-4 py-2 text-sm font-medium transition-colors ${darkMode ? 'text-dark-300 hover:text-white' : 'text-dark-700 hover:text-aurora-purple'}`}>
                Login
              </Link>
              <Link to="/signup" className="btn-aurora px-5 py-2 text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Aurora orbs */}
        <div className="aurora-orb w-[500px] h-[500px] -top-32 -left-32"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-[400px] h-[400px] top-20 right-0"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-[300px] h-[300px] bottom-0 left-1/3"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
              <HiOutlineLightBulb className="w-4 h-4" />
              Your Complete Placement Companion
            </motion.div>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Logo size="2xl" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-dark-900 dark:text-white mb-6 leading-tight">
              Ace Your Campus<br />
              <span className="aurora-text">Placements</span>
            </h1>

            <p className="text-lg md:text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto mb-10">
              PrepNova — comprehensive preparation for aptitude, DSA, and company-specific interviews. Start your journey to your dream job today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup"
                className="group btn-aurora flex items-center gap-2 px-8 py-4 text-base">
                Start Learning Free
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login"
                className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: '#8B5CF6'
                }}>
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-5 rounded-2xl"
                style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <div className="text-3xl font-extrabold aurora-text mb-1">{stat.value}</div>
                <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="aurora-text">Succeed</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>
              Three powerful modules to get you placement-ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card-aurora p-8 group relative overflow-hidden">
                  <div className="aurora-orb w-48 h-48 -top-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: feature.gradient }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-dark-900'}`}>{feature.title}</h3>
                    <p className={`leading-relaxed ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="aurora-orb w-96 h-96 -top-20 left-1/4"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-80 h-80 bottom-0 right-1/4"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-block p-0.5 rounded-3xl mb-8"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4)' }}>
              <div className="px-8 py-10 rounded-3xl"
                style={{ background: darkMode ? '#080d1a' : '#f0f4ff' }}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-dark-900 dark:text-white mb-4">
                  Ready to Launch Your Career?
                </h2>
                <p className="text-dark-500 dark:text-dark-400 mb-8 max-w-lg mx-auto">
                  Join PrepNova and start preparing smarter for your campus placements.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {['500+ Questions', '50+ Companies', 'Free to Start'].map(text => (
                    <span key={text} className="flex items-center gap-1.5 text-sm text-dark-500">
                      <HiCheck className="w-4 h-4" style={{ color: '#8B5CF6' }} /> {text}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                  <Link to="/signup" className="btn-aurora inline-flex items-center gap-2 px-8 py-4 text-base">
                    Create Free Account <HiArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Logo size="xs" />
            <span className="font-extrabold aurora-text">PrepNova</span>
          </div>
          <p className="text-sm text-dark-500">© 2026 PrepNova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
