// src/__tests__/integration/health.test.ts
import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../../app'

describe('Health Check API', () => {
  it('should return 200 and server status', async () => {
    const response = await request(app).get('/api/v1/health').expect(200)

    expect(response.body).toEqual({
      status: 'success',
      message: 'Server is running',
      timestamp: expect.any(String),
    })
  })

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/api/v1/unknown-route').expect(404)

    expect(response.body.status).toBe('error')
    expect(response.body.message).toContain('not found')
  })
})
