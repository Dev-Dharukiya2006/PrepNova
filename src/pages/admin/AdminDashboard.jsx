import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineChartPie,
  HiOutlineDocumentText,
  HiOfficeBuilding,
  HiOutlineUsers
} from 'react-icons/hi'

const AdminDashboard = () => {
  const navItems = [
    { path: '/admin/questions', label: 'Manage Questions', icon: HiOutlineDocumentText },
    { path: '/admin/companies', label: 'Manage Companies', icon: HiOfficeBuilding },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-dark-800 to-dark-900 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex items-center gap-3">
          <HiOutlineChartPie className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-dark-400">Manage questions, companies, and users</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          )
        })}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Outlet />
      </motion.div>
    </div>
  )
}

export default AdminDashboard
