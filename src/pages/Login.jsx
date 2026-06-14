import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineMail, HiOutlineLockClosed, HiArrowRight, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-dark-50 dark:bg-dark-900">
      {/* Left: Aurora panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f24 0%, #0d1428 100%)' }}>
        {/* Orbs */}
        <div className="aurora-orb w-96 h-96 top-0 left-0"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-64 h-64 bottom-0 right-0"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-48 h-48 bottom-1/3 left-1/4"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-center">
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Logo size="2xl" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-3">Welcome Back!</h2>
            <p className="text-lg max-w-sm"
              style={{ color: 'rgba(199,210,254,0.8)' }}>
              Continue your journey towards your dream placement.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-8 text-center">
            {[['500+','Questions'], ['50+','Companies'], ['38+','Topics']].map(([val, label]) => (
              <div key={label} className="p-4 rounded-2xl"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="text-3xl font-extrabold aurora-text">{val}</div>
                <div className="text-sm mt-1" style={{ color: 'rgba(199,210,254,0.7)' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-2xl font-extrabold aurora-text">PrepNova</span>
            </Link>
          </div>

          <div className="card-aurora p-8">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">Sign In</h2>
            <p className="text-dark-500 dark:text-dark-400 mb-7 text-sm">Access your PrepNova account</p>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field pl-12" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password"
                  className="text-sm font-medium"
                  style={{ color: '#8B5CF6' }}>
                  Forgot password?
                </Link>
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-aurora w-full flex items-center justify-center gap-2 py-3">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Sign In</span><HiArrowRight className="w-5 h-5" /></>}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-dark-500 dark:text-dark-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold" style={{ color: '#8B5CF6' }}>Sign up free</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
