import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

// All routes require authentication
router.get('/profile', authenticateToken, userController.getProfile)
router.put('/profile', authenticateToken, userController.updateProfile)
router.get('/progress', authenticateToken, userController.getProgress)
router.get('/progress/:userId', userController.getProgress)
router.get('/dashboard', authenticateToken, userController.getDashboardStats)

export default router
