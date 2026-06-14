import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOfficeBuilding,
  HiSearch,
  HiOutlineStar,
  HiCheck
} from 'react-icons/hi'
import { getCompanies, getUserCompanyPreparation } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const Companies = () => {
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [savedCompanies, setSavedCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, prepData] = await Promise.all([
          getCompanies(),
          user ? getUserCompanyPreparation(user.id) : Promise.resolve([])
        ])
        setCompanies(companiesData || [])
        setSavedCompanies((prepData || []).filter(p => p.is_saved).map(p => p.company_id))
      } catch (error) {
        console.error('Error fetching companies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const categories = [
    { id: 'all', label: 'All Companies' },
    { id: 'service', label: 'Service Companies' },
    { id: 'product', label: 'Product Companies' },
    { id: 'startup', label: 'Startups' }
  ]

  const categoryColors = {
    service: 'from-blue-500 to-indigo-500',
    product: 'from-purple-500 to-pink-500',
    startup: 'from-orange-500 to-red-500'
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Company Preparation</h1>
        <p className="text-purple-100">
          Prepare for specific companies with tailored roadmaps and interview guides.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies..."
            className="input-field pl-12"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company, index) => {
          const isSaved = savedCompanies.includes(company.id)
          const color = categoryColors[company.category] || 'from-gray-500 to-gray-600'

          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={`/companies/${company.id}`}
                className="block card-hover p-6 h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
                    <HiOfficeBuilding className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    {isSaved && (
                      <HiOutlineStar className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded capitalize ${
                      company.category === 'service' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      company.category === 'product' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {company.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                  {company.name}
                </h3>

                {company.overview && (
                  <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-2 mb-4">
                    {company.overview}
                  </p>
                )}

                {company.salary_range && (
                  <div className="mb-4 text-sm">
                    <span className="text-dark-500 dark:text-dark-400">Salary: </span>
                    <span className="font-medium text-dark-900 dark:text-white">
                      {company.salary_range}
                    </span>
                  </div>
                )}

                {/* Key topics */}
                <div className="flex flex-wrap gap-1">
                  {(company.aptitude_topics || []).slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                  {(company.dsa_topics || []).slice(0, 2).map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <HiOfficeBuilding className="w-12 h-12 mx-auto mb-4 text-dark-400" />
          <p className="text-dark-600 dark:text-dark-400">No companies found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default Companies
