import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import helmet from 'helmet'

import morganMiddleware from './middleware/morgan'

const app = express()

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: process.env.OPENAPI_TITLE || 'BS API',
    version: process.env.OPENAPI_VERSION || '1.0.0',
    description:
      process.env.OPENAPI_DESCRIPTION || 'A TypeScript-based REST API for a blog application',
  },
  servers: [
    {
      url: process.env.OPENAPI_SERVER_URL || 'http://localhost:3000',
    },
  ],
}

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./src/**/*.ts'], // Paths to files containing OpenAPI definitions
}

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options)

app.use(helmet())
app.use(morganMiddleware)

// Serve API docs (not versioned — keep this global)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  })
})

export default app
