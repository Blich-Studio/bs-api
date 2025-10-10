import request from 'supertest'

import app from '../app'

describe('GET /v1/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/v1/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
