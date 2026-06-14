import { Router } from 'express'
import * as dsaController from '../controllers/dsa.controller.js'
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// Topics - public
router.get('/topics', dsaController.getTopics)
router.get('/topics/:id', dsaController.getTopic)

// Questions - public with optional auth
router.get('/topics/:topicId/questions', optionalAuth, dsaController.getQuestions)

// Results - require auth
router.post('/submit', optionalAuth, dsaController.submitTest)
router.get('/results', authenticateToken, dsaController.getUserResults)

export default router
