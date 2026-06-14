import { Router } from 'express'
import * as aptitudeController from '../controllers/aptitude.controller.js'
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// Topics - public
router.get('/topics', aptitudeController.getTopics)
router.get('/topics/:id', aptitudeController.getTopic)

// Questions - public with optional auth
router.get('/topics/:topicId/questions', optionalAuth, aptitudeController.getQuestions)
router.get('/questions/:id', aptitudeController.getQuestion)

// Results - require auth
router.post('/submit', optionalAuth, aptitudeController.submitTest)
router.get('/results', authenticateToken, aptitudeController.getUserResults)

export default router
