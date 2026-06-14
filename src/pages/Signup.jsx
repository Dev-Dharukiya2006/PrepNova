import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeOff, HiArrowRight, HiCheck
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other']

const Signup = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirmPassword: '',
    college: '', branch: '', year: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const strengthScore = (pw) => {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }

  const strength = strengthScore(form.password)
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong']

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (!form.full_name.trim()) return setError('Please enter your full name')

    setLoading(true)
    try {
      const result = await register(form)
      if (result.success) {
        toast.success('Account created! Welcome to PrepNova!')
        navigate('/dashboard')
      } else {
        setError(result.message || 'Failed to create account')
      }
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-dark-50 dark:bg-dark-900">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md py-6">
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-2xl font-extrabold aurora-text">PrepNova</span>
            </Link>
          </div>

          <div className="card-aurora p-8">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">Create Account</h2>
            <p className="text-dark-500 dark:text-dark-400 mb-6 text-sm">Start your placement prep journey</p>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mb-5 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Full Name *</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                    className="input-field pl-12" placeholder="John Doe" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Email *</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="input-field pl-12" placeholder="you@example.com" required />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    className="input-field pl-12 pr-12" placeholder="Min. 6 characters" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0,1,2,3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          i < strength ? strengthColor[strength - 1] : 'bg-dark-200 dark:bg-dark-700'
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-dark-400 mt-1">{strength > 0 && strengthLabel[strength - 1]} password</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} className="input-field pl-12 pr-12" placeholder="Repeat password" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">
                    {showConfirm ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <HiCheck className="w-3.5 h-3.5" /> Passwords match
                  </p>
                )}
              </div>

              {/* Branch + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Branch</label>
                  <select name="branch" value={form.branch} onChange={handleChange} className="input-field">
                    <option value="">Select</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Year</label>
                  <select name="year" value={form.year} onChange={handleChange} className="input-field">
                    <option value="">Select</option>
                    {[1,2,3,4].map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
                  </select>
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">College</label>
                <input type="text" name="college" value={form.college} onChange={handleChange}
                  className="input-field" placeholder="Your college name" />
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-aurora w-full flex items-center justify-center gap-2 py-3 mt-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Create Account</span><HiArrowRight className="w-5 h-5" /></>}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-sm text-dark-500 dark:text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#8B5CF6' }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right: Aurora panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1428 0%, #0a0f24 100%)' }}>
        <div className="aurora-orb w-72 h-72 top-10 right-10"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-80 h-80 bottom-10 left-0"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Logo size="2xl" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-extrabold text-white text-center mb-3">Join PrepNova</h2>
            <p className="text-center text-lg max-w-sm" style={{ color: 'rgba(199,210,254,0.8)' }}>
              Your all-in-one platform for campus placement success.
            </p>
          </motion.div>

          <div className="mt-10 space-y-3 w-full max-w-xs">
            {[
              'Master 500+ aptitude questions',
              'Learn DSA with real examples',
              'Prepare for 50+ top companies',
              'Track progress with analytics'
            ].map((text, i) => (
              <motion.div key={text} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
                  <HiCheck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm" style={{ color: 'rgba(199,210,254,0.9)' }}>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
