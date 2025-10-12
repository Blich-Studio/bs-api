import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import helmet from 'helmet'

import morganMiddleware from './middleware/morgan'

//FIXME
//import healthRouter from './routes/health'

const app = express()
const swaggerDocument = YAML.load('./openapi.yaml')

app.use(helmet())
app.use(morganMiddleware)
// Serve API docs (not versioned — keep this global)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//FIXME delete this before deploy to prod
app.get('/logger', (_, res) => {
  res.send('Hello world')
})

// ✅ Base API version path
//app.use('/v1/health', healthRouter)

export default app
