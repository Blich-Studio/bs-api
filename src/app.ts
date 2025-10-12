import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import helmet from 'helmet'

import morganMiddleware from './middleware/morgan'

const app = express()
const swaggerDocument = YAML.load('./openapi.yaml')

app.use(helmet())
app.use(morganMiddleware)

// Serve API docs (not versioned — keep this global)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  })
})

export default app
