import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../index.js'

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Register new user
export const register = async (req, res) => {
  try {
    const { full_name, email, password, college, branch, year } = req.body

    // Validation
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      })
    }

    // Check if user exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) {
      // Fallback: Create user manually if Supabase auth fails
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          email,
          full_name,
          college,
          branch,
          year: year ? parseInt(year) : null,
          role: 'student'
        }])
        .select()
        .single()

      if (insertError) throw insertError

      const token = generateToken(newUser)
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: { ...newUser, password_hash: undefined },
          token
        }
      })
    }

    // Create user profile
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        full_name,
        college,
        branch,
        year: year ? parseInt(year) : null,
        role: 'student'
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Profile creation error:', insertError)
    }

    // Create initial progress record
    await supabase
      .from('user_progress')
      .insert([{
        user_id: authData.user.id,
        aptitude_completed: 0,
        aptitude_total: 0,
        dsa_completed: 0,
        dsa_total: 0,
        total_tests: 0
      }])

    const token = generateToken(authData.user)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser || { id: authData.user.id, email, full_name },
        token
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Try Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    const token = generateToken(authData.user)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userProfile || { id: authData.user.id, email: authData.user.email },
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
}

// Logout user
export const logout = async (req, res) => {
  try {
    await supabase.auth.signOut()
    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    })
  }
}

// Get current user
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    })
  }
}

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      })
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    })

    if (error) throw error

    res.json({
      success: true,
      message: 'Password reset email sent'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send reset email'
    })
  }
}

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    res.json({
      success: true,
      message: 'Password reset successful'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    })
  }
}

// Verify token
export const verifyToken = async (req, res) => {
  try {
    const { user } = req

    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    res.json({
      success: true,
      valid: true,
      data: userProfile
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    })
  }
}
