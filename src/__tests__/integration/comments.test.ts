import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../../app'

describe('Comments API', () => {
  describe('POST /api/v1/articles/:articleId/comments', () => {
    it('should create comment for published article', async () => {
      const commentData = {
        content: 'Great article!',
      }

      const response = await request(app)
        .post('/api/v1/articles/article-123/comments')
        .set('Authorization', 'Bearer valid-token')
        .send(commentData)
        .expect(201)

      expect(response.body.data.comment.content).toBe(commentData.content)
    })

    it('should allow nested comments', async () => {
      const commentData = {
        content: 'This is a reply',
        parent_id: 'parent-comment-123',
      }

      const response = await request(app)
        .post('/api/v1/articles/article-123/comments')
        .set('Authorization', 'Bearer valid-token')
        .send(commentData)
        .expect(201)

      expect(response.body.data.comment.parent_id).toBe(commentData.parent_id)
    })
  })

  describe('GET /api/v1/articles/:articleId/comments', () => {
    it('should return paginated comments', async () => {
      const response = await request(app).get('/api/v1/articles/article-123/comments').expect(200)

      expect(response.body.data.comments).toBeInstanceOf(Array)
      expect(response.body.pagination).toBeDefined()
    })
  })
})
