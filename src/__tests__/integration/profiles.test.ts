import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../../app'

describe('Profiles API', () => {
  describe('GET /api/v1/profiles/:username', () => {
    it('should return user profile', async () => {
      const response = await request(app).get('/api/v1/profiles/testuser').expect(200)

      expect(response.body.data.profile.username).toBe('testuser')
      expect(response.body.data.profile.stats).toBeDefined()
    })

    it('should return 404 for non-existent profile', async () => {
      await request(app).get('/api/v1/profiles/non-existent-user').expect(404)
    })
  })

  describe('PUT /api/v1/profiles/me', () => {
    it('should update user profile', async () => {
      const updateData = {
        username: 'newusername',
        full_name: 'New Name',
        bio: 'Updated bio',
      }

      const response = await request(app)
        .put('/api/v1/profiles/me')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)
        .expect(200)

      expect(response.body.data.profile.username).toBe(updateData.username)
    })

    it('should reject duplicate username', async () => {
      const updateData = {
        username: 'existinguser',
      }

      await request(app)
        .put('/api/v1/profiles/me')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)
        .expect(409)
    })
  })
})
