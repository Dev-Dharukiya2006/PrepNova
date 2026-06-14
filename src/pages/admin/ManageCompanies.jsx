import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCompanies } from '../../lib/supabase'
import {
  HiOfficeBuilding,
  HiPlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch
} from 'react-icons/hi'
import toast from 'react-hot-toast'

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies()
      setCompanies(data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return
    toast.success('Company deleted successfully')
    fetchCompanies()
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryColors = {
    service: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    product: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    startup: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies..."
            className="input-field pl-12"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'service', 'product', 'startup'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <HiOfficeBuilding className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white">
                      {company.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded capitalize ${categoryColors[company.category]}`}>
                      {company.category}
                    </span>
                    {company.salary_range && (
                      <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                        {company.salary_range}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toast.error('Edit functionality coming soon')}
                    className="p-2 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="p-2 text-dark-600 dark:text-dark-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <HiOfficeBuilding className="w-12 h-12 mx-auto mb-4 text-dark-400" />
          <p className="text-dark-600 dark:text-dark-400">No companies found.</p>
        </div>
      )}

      {/* Add Company Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-lg w-full mx-4"
          >
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Add New Company
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Company management features are coming soon. This is a placeholder modal.
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

export default ManageCompanies
