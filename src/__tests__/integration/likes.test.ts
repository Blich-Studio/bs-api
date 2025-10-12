import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../../app'

describe('Likes API', () => {
  describe('POST /api/v1/articles/:articleId/like', () => {
    it('should like an article', async () => {
      const response = await request(app)
        .post('/api/v1/articles/article-123/like')
        .set('Authorization', 'Bearer valid-token')
        .expect(201)

      expect(response.body.data.like.article_id).toBe('article-123')
    })

    it('should prevent duplicate likes', async () => {
      // First like
      await request(app)
        .post('/api/v1/articles/article-123/like')
        .set('Authorization', 'Bearer valid-token')

      // Second like should fail
      await request(app)
        .post('/api/v1/articles/article-123/like')
        .set('Authorization', 'Bearer valid-token')
        .expect(409)
    })
  })

  describe('DELETE /api/v1/articles/:articleId/like', () => {
    it('should remove like from article', async () => {
      await request(app)
        .delete('/api/v1/articles/article-123/like')
        .set('Authorization', 'Bearer valid-token')
        .expect(204)
    })
  })
})
