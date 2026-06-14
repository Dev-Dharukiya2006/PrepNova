import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Import routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import aptitudeRoutes from './routes/aptitude.routes.js'
import dsaRoutes from './routes/dsa.routes.js'
import companyRoutes from './routes/company.routes.js'
import adminRoutes from './routes/admin.routes.js'

dotenv.config()

const app = express()

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/aptitude', aptitudeRoutes)
app.use('/api/dsa', dsaRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/admin', adminRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Smart Placement Server is running!                   ║
║                                                           ║
║   Port: ${PORT}                                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   API: http://localhost:${PORT}/api                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
})

export default app
