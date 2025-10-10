import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import healthRouter from './routes/health'

const app = express()
const swaggerDocument = YAML.load('./openapi.yaml')

// Serve API docs (not versioned — keep this global)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// ✅ Base API version path
app.use('/v1/health', healthRouter)

export default app
