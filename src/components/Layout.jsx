import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import {
  HiOutlineHome, HiOutlineChartBar, HiOutlineBookOpen,
  HiOfficeBuilding, HiOutlineUser, HiOutlineMoon, HiOutlineSun,
  HiOutlineMenu, HiOutlineX, HiOutlineLogout
} from 'react-icons/hi'
import { signOut } from '../lib/supabase'
import Logo from './Logo'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/aptitude', label: 'Aptitude', icon: HiOutlineChartBar },
  { path: '/dsa', label: 'DSA', icon: HiOutlineBookOpen },
  { path: '/companies', label: 'Companies', icon: HiOfficeBuilding },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
]

const Layout = () => {
  const { darkMode, toggleTheme } = useTheme()
  const { user, profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  const sidebarBg = darkMode
    ? 'linear-gradient(180deg, #0a0f24 0%, #0d1428 50%, #080d1a 100%)'
    : '#ffffff'
  const sidebarBorder = darkMode
    ? '1px solid rgba(139,92,246,0.15)'
    : '1px solid #e1e9ff'

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-900' : 'bg-dark-50'}`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: sidebarBg, borderRight: sidebarBorder }}
      >
        {/* Aurora orbs – dark only */}
        {darkMode && (
          <>
            <div className="aurora-orb w-48 h-48 -top-8 -left-8"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }} />
            <div className="aurora-orb w-32 h-32 bottom-20 right-0"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' }} />
          </>
        )}

        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4"
            style={{ borderBottom: sidebarBorder }}>
            <Link to="/" className="flex items-center space-x-2 group">
              <Logo size="sm" />
              <span className="text-xl font-extrabold aurora-text">PrepNova</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-dark-800 text-dark-300' : 'hover:bg-dark-100 text-dark-600'}`}>
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden"
                  style={isActive ? {
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.15))'
                      : 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))',
                    boxShadow: '0 2px 12px rgba(139,92,246,0.15)',
                    border: darkMode ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(139,92,246,0.25)',
                    color: darkMode ? '#a78bfa' : '#7c3aed',
                  } : {
                    color: darkMode ? '#94a3b8' : '#475569',
                  }}
                >
                  <Icon className={`w-5 h-5 mr-3 relative z-10 transition-colors ${isActive ? '' : 'group-hover:text-aurora-purple'}`} />
                  <span className={`relative z-10 font-medium text-sm ${
                    !isActive && (darkMode ? 'group-hover:text-white' : 'group-hover:text-dark-900')
                  }`}>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: 'linear-gradient(to bottom, #8B5CF6, #06B6D4)' }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Theme Toggle */}
          <div className="p-4" style={{ borderTop: sidebarBorder }}>
            {user && (
              <div className="flex items-center mb-4 p-2 rounded-xl"
                style={{ background: darkMode ? 'rgba(139,92,246,0.08)' : '#f5f3ff' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
                  <span className="text-white font-bold text-sm">{initials}</span>
                </div>
                <div className="ml-3 min-w-0">
                  <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-dark-900'}`}>
                    {displayName}
                  </p>
                  <p className="text-xs text-dark-400 truncate">
                    {profile?.email || user?.email || ''}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105"
                style={darkMode ? {
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.25)',
                } : {
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                }}>
                {darkMode
                  ? <HiOutlineSun className="w-4 h-4 text-yellow-400" />
                  : <HiOutlineMoon className="w-4 h-4" style={{ color: '#7c3aed' }} />}
                <span className={`text-xs font-semibold ${darkMode ? 'text-dark-300' : 'text-dark-700'}`}>
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>

              {user && (
                <button onClick={handleLogout}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 ${
                    darkMode ? 'text-dark-400 hover:text-red-400' : 'text-dark-500 hover:text-red-500'
                  }`}>
                  <HiOutlineLogout className="w-4 h-4 mr-1.5" />
                  <span className="text-xs font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16"
          style={{
            background: darkMode ? 'rgba(8,13,26,0.85)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: darkMode ? '1px solid rgba(139,92,246,0.12)' : '1px solid rgba(139,92,246,0.15)',
          }}>
          <div className="flex items-center justify-between h-full px-4">
            <button onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-dark-800 text-dark-300' : 'hover:bg-dark-100 text-dark-700'}`}>
              <HiOutlineMenu className="w-5 h-5" />
            </button>

            <div className="flex-1 lg:hidden flex items-center space-x-2">
              <Logo size="xs" />
              <span className="text-lg font-extrabold aurora-text">PrepNova</span>
            </div>

            <div className="hidden lg:block">
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-dark-900'}`}>
                {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={toggleTheme}
                className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-dark-800' : 'hover:bg-dark-100'}`}>
                {darkMode
                  ? <HiOutlineSun className="w-5 h-5 text-yellow-400" />
                  : <HiOutlineMoon className="w-5 h-5" style={{ color: '#7c3aed' }} />}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Layout
