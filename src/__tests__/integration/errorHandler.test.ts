import request from 'supertest'
//import { ZodError } from 'zod'

import app from '../../app'

describe('Error Handler Middleware', () => {
  it('should return 404 for non-existent routes', async () => {
    await request(app).get('/api/v1/non-existent-route').expect(404)
  })

  it('should return 500 for unhandled errors', async () => {
    // Mock a route that throws an unhandled error
    // You might need to create a test route for this
    const response = await request(app).get('/api/v1/test-error').expect(500)

    expect(response.body.error).toBe('Internal Server Error')
  })

  it('should handle Zod errors with detailed validation messages', async () => {
    const response = await request(app)
      .post('/api/v1/articles')
      .send({ invalid: 'data' })
      .expect(400)

    expect(response.body.error).toBe('Validation Error')
    expect(response.body.details).toBeDefined()
  })

  it('should handle JSON parse errors', async () => {
    await request(app)
      .post('/api/v1/articles')
      .set('Content-Type', 'application/json')
      .send('invalid json {')
      .expect(400)
  })
})
