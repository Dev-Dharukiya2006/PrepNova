import { Router } from 'express'
import * as companyController from '../controllers/company.controller.js'
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// Public routes
router.get('/', companyController.getCompanies)
router.get('/:id', companyController.getCompany)

// Protected routes
router.post('/:companyId/save', authenticateToken, companyController.saveCompany)
router.post('/:companyId/complete', authenticateToken, companyController.markComplete)
router.get('/user/saved', authenticateToken, companyController.getUserCompanies)

export default router
