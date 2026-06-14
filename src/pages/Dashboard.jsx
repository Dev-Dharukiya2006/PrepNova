import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOfficeBuilding,
  HiOutlineDocumentText,
  HiArrowRight,
  HiOutlineTrendingUp,
  HiOutlineExclamation
} from 'react-icons/hi'
import { getAptitudeResults, getDSAResults, getUserCompanyPreparation } from '../lib/supabase'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const { user, profile, progress } = useAuth()
  const [aptitudeResults, setAptitudeResults] = useState([])
  const [dsaResults, setDSAResults] = useState([])
  const [savedCompanies, setSavedCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const [aptData, dsaData, companyData] = await Promise.all([
          getAptitudeResults(user.id),
          getDSAResults(user.id),
          getUserCompanyPreparation(user.id)
        ])

        setAptitudeResults(aptData || [])
        setDSAResults(dsaData || [])
        setSavedCompanies((companyData || []).filter(c => c.is_saved))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const stats = [
    {
      label: 'Aptitude Progress',
      value: progress?.aptitude_completed || 0,
      total: progress?.aptitude_total || 0,
      icon: HiOutlineChartBar,
      color: 'from-blue-500 to-cyan-500',
      link: '/aptitude'
    },
    {
      label: 'DSA Progress',
      value: progress?.dsa_completed || 0,
      total: progress?.dsa_total || 0,
      icon: HiOutlineBookOpen,
      color: 'from-green-500 to-emerald-500',
      link: '/dsa'
    },
    {
      label: 'Tests Attempted',
      value: progress?.total_tests || 0,
      total: null,
      icon: HiOutlineDocumentText,
      color: 'from-purple-500 to-pink-500',
      link: null
    },
    {
      label: 'Saved Companies',
      value: savedCompanies.length,
      total: null,
      icon: HiOfficeBuilding,
      color: 'from-orange-500 to-red-500',
      link: '/companies'
    }
  ]

  const weeklyProgressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Questions Solved',
        data: [12, 19, 8, 15, 22, 10, 17],
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  const performanceData = {
    labels: ['Quantitative', 'Logical', 'Verbal', 'DSA'],
    datasets: [
      {
        label: 'Accuracy %',
        data: [
          calculateAccuracy(aptitudeResults.filter(r => r.aptitude_topics?.category === 'quantitative')),
          calculateAccuracy(aptitudeResults.filter(r => r.aptitude_topics?.category === 'logical')),
          calculateAccuracy(aptitudeResults.filter(r => r.aptitude_topics?.category === 'verbal')),
          calculateAccuracy(dsaResults)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderRadius: 8
      }
    ]
  }

  const categoryData = {
    labels: ['Aptitude', 'DSA', 'Company Prep'],
    datasets: [
      {
        data: [
          progress?.aptitude_completed || 0,
          progress?.dsa_completed || 0,
          savedCompanies.length * 10
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    cutout: '70%'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-primary-100">
          {progress?.last_active
            ? `Last active ${formatLastActive(progress.last_active)}`
            : 'Start your placement preparation journey today'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const percentage = stat.total ? Math.round((stat.value / stat.total) * 100) : null

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link || '#'}
                className={`block card-hover p-6 ${stat.link ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {percentage !== null && (
                    <span className="text-sm font-medium text-dark-500 dark:text-dark-400">
                      {percentage}%
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">
                  {stat.value}{stat.total ? `/${stat.total}` : ''}
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">{stat.label}</p>

                {percentage !== null && (
                  <div className="mt-3 h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
            Weekly Progress
          </h3>
          <div className="h-64">
            <Line data={weeklyProgressData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
            Preparation Overview
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Performance & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
            Performance by Category
          </h3>
          <div className="h-64">
            <Bar data={performanceData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Weak Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
              Areas to Improve
            </h3>
            <HiOutlineExclamation className="w-5 h-5 text-orange-500" />
          </div>

          <div className="space-y-4">
            {progress?.weak_topics?.length > 0 ? (
              progress.weak_topics.map((topic, index) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                >
                  <span className="text-dark-700 dark:text-dark-300">{topic}</span>
                  <Link
                    to="/aptitude"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center"
                  >
                    Practice <HiArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-dark-500 dark:text-dark-400">
                <HiOutlineTrendingUp className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>Great job! No weak areas identified yet.</p>
                <p className="text-sm mt-1">Take more tests to get personalized insights.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/aptitude"
            className="flex items-center justify-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <HiOutlineChartBar className="w-6 h-6 text-primary-600" />
            <span className="font-medium text-primary-700 dark:text-primary-300">Practice Aptitude</span>
          </Link>
          <Link
            to="/dsa"
            className="flex items-center justify-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <HiOutlineBookOpen className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-700 dark:text-green-300">Learn DSA</span>
          </Link>
          <Link
            to="/companies"
            className="flex items-center justify-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <HiOfficeBuilding className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-700 dark:text-purple-300">Browse Companies</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function calculateAccuracy(results) {
  if (!results || results.length === 0) return 0
  const totalCorrect = results.reduce((sum, r) => sum + (r.correct_answers || 0), 0)
  const totalQuestions = results.reduce((sum, r) => sum + (r.total_questions || 0), 0)
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
}

function formatLastActive(date) {
  const now = new Date()
  const last = new Date(date)
  const diffMs = now - last
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

export default Dashboard
