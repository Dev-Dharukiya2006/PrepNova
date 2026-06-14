import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import {
  HiOutlineMail,
  HiArrowRight,
  HiOutlineArrowLeft,
  HiCheck,
  HiOutlineAcademicCap
} from 'react-icons/hi'
import Logo from '../components/Logo'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-900 transition-colors duration-300 p-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="sm" />
            <span className="text-2xl font-extrabold aurora-text">PrepNova</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 border dark:border-dark-700">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mb-6">
                No worries! Enter your email and we'll send you reset instructions.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-12"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <HiArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <HiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">
                We've sent password reset instructions to{' '}
                <span className="font-medium text-dark-900 dark:text-white">{email}</span>
              </p>
              <p className="text-sm text-dark-500 dark:text-dark-400">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  try again
                </button>
              </p>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <HiOutlineArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
