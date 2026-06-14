import { Router } from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/auth.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').notEmpty().withMessage('Please provide your name')
]

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
]

// Routes
router.post('/register', registerValidation, authController.register)
router.post('/login', loginValidation, authController.login)
router.post('/logout', authController.logout)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.get('/me', authenticateToken, authController.getMe)
router.get('/verify', authenticateToken, authController.verifyToken)

export default router
