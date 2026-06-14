import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowLeft,
  HiOutlineStar,
  HiStar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOfficeBuilding,
  HiCheckCircle,
  HiOutlineCheck,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi'
import { getCompany, saveCompanyPreparation, getUserCompanyPreparation } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const CompanyDetail = () => {
  const { companyId } = useParams()
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [preparation, setPreparation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyData, prepData] = await Promise.all([
          getCompany(companyId),
          user ? getUserCompanyPreparation(user.id) : Promise.resolve([])
        ])
        setCompany(companyData)
        const userPrep = (prepData || []).find(p => p.company_id === parseInt(companyId))
        setPreparation(userPrep)
      } catch (error) {
        console.error('Error fetching company:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [companyId, user])

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save companies')
      return
    }

    setSaving(true)
    try {
      const data = await saveCompanyPreparation({
        user_id: user.id,
        company_id: parseInt(companyId),
        is_saved: !preparation?.is_saved
      })
      setPreparation(data?.[0] || { ...preparation, is_saved: !preparation?.is_saved })
      toast.success(preparation?.is_saved ? 'Removed from saved' : 'Added to saved')
    } catch (error) {
      console.error('Error saving company:', error)
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!user) {
      toast.error('Please login to mark as complete')
      return
    }

    setSaving(true)
    try {
      const data = await saveCompanyPreparation({
        user_id: user.id,
        company_id: parseInt(companyId),
        is_completed: !preparation?.is_completed,
        progress: preparation?.is_completed ? 0 : 100
      })
      setPreparation(data?.[0] || { ...preparation, is_completed: !preparation?.is_completed })
      toast.success(preparation?.is_completed ? 'Marked as incomplete' : 'Marked as complete')
    } catch (error) {
      console.error('Error updating:', error)
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-600 dark:text-dark-400">Company not found</p>
        <Link to="/companies" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to Companies
        </Link>
      </div>
    )
  }

  const categoryColors = {
    service: 'from-blue-500 to-indigo-500',
    product: 'from-purple-500 to-pink-500',
    startup: 'from-orange-500 to-red-500'
  }

  const color = categoryColors[company.category] || 'from-gray-500 to-gray-600'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${color} rounded-2xl p-6 md:p-8 text-white`}
      >
        <Link
          to="/companies"
          className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4 mr-1" /> Back to Companies
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/20">
              <HiOfficeBuilding className="w-8 h-8" />
            </div>
            <div>
              <span className="text-sm uppercase tracking-wider text-white/80 capitalize">
                {company.category} Company
              </span>
              <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
              {company.salary_range && (
                <p className="text-white/80 mt-1">
                  Salary Range: {company.salary_range}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                preparation?.is_saved
                  ? 'bg-white text-yellow-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {preparation?.is_saved ? (
                <HiStar className="w-5 h-5" />
              ) : (
                <HiOutlineStar className="w-5 h-5" />
              )}
              {preparation?.is_saved ? 'Saved' : 'Save'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkComplete}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                preparation?.is_completed
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {preparation?.is_completed ? (
                <HiCheckCircle className="w-5 h-5" />
              ) : (
                <HiOutlineCheck className="w-5 h-5" />
              )}
              {preparation?.is_completed ? 'Completed' : 'Mark Complete'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Company Overview
            </h2>
            <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
              {company.overview || `${company.name} is a leading ${company.category} company offering excellent career opportunities for fresh graduates.`}
            </p>
          </motion.div>

          {/* Hiring Process */}
          {company.hiring_process && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Hiring Process
              </h2>
              <div className="space-y-4">
                {typeof company.hiring_process === 'object' ? (
                  Object.entries(company.hiring_process).map(([round, details], index) => (
                    <div key={round} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-dark-900 dark:text-white capitalize">
                          {round.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-dark-600 dark:text-dark-400">
                          {typeof details === 'string' ? details : JSON.stringify(details)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-dark-600 dark:text-dark-400">{company.hiring_process}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Important Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Important Topics to Prepare
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-dark-900 dark:text-white mb-3">
                  Aptitude Topics
                </h3>
                <div className="space-y-2">
                  {(company.aptitude_topics || []).map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-dark-600 dark:text-dark-400"
                    >
                      <HiOutlineCheck className="w-4 h-4 text-blue-500" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-dark-900 dark:text-white mb-3">
                  DSA Topics
                </h3>
                <div className="space-y-2">
                  {(company.dsa_topics || []).map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-dark-600 dark:text-dark-400"
                    >
                      <HiOutlineCheck className="w-4 h-4 text-green-500" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interview Questions */}
          {company.interview_questions && company.interview_questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Frequently Asked Interview Questions
              </h2>
              <div className="space-y-4">
                {company.interview_questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                      <p className="text-dark-800 dark:text-dark-200">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Quick Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-600 dark:text-dark-400">Category</span>
                <span className="font-medium text-dark-900 dark:text-white capitalize">{company.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-600 dark:text-dark-400">Type</span>
                <span className="font-medium text-dark-900 dark:text-white capitalize">{company.category} Company</span>
              </div>
              {company.salary_range && (
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 dark:text-dark-400">Salary</span>
                  <span className="font-medium text-dark-900 dark:text-white">{company.salary_range}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Preparation Tips */}
          {company.preparation_tips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Preparation Tips
              </h3>
              <div className="text-sm text-dark-600 dark:text-dark-400">
                {company.preparation_tips}
              </div>
            </motion.div>
          )}

          {/* Your Progress */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                Your Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 dark:text-dark-400">Saved</span>
                  {preparation?.is_saved ? (
                    <span className="text-yellow-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-dark-500">No</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 dark:text-dark-400">Completed</span>
                  {preparation?.is_completed ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-dark-500">No</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Start Practice
            </h3>
            <div className="space-y-3">
              <Link
                to="/aptitude"
                className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center"
              >
                Practice Aptitude
              </Link>
              <Link
                to="/dsa"
                className="block p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-center"
              >
                Practice DSA
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetail
