import { Router } from 'express'

import { createHealthController } from '../controllers/health.controller'

const router = Router()
const healthController = createHealthController()

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the application
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *                 uptime:
 *                   type: number
 *                   description: Application uptime in seconds
 *                   example: 3600
 */
router.get('/health', healthController.getHealth.bind(healthController))

export default router
