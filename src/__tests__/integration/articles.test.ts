import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

import app from '../../app'

describe('Articles API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/v1/articles', () => {
    it('should return paginated articles', async () => {
      const response = await request(app).get('/api/v1/articles').expect(200)

      expect(response.body).toMatchObject({
        status: 'success',
        data: {
          articles: expect.any(Array),
        },
        pagination: {
          current: expect.any(Number),
          limit: expect.any(Number),
          total: expect.any(Number),
          pages: expect.any(Number),
        },
      })
    })

    it('should filter articles by tag', async () => {
      const response = await request(app).get('/api/v1/articles?tag=typescript').expect(200)

      // Add specific assertions based on your filter logic
      expect(response.body.status).toBe('success')
    })
  })

  describe('POST /api/v1/articles', () => {
    it('should create article with valid data', async () => {
      const articleData = {
        title: 'Test Article',
        content: 'Test content',
        excerpt: 'Test excerpt',
        tags: ['test'],
        status: 'draft',
      }

      const response = await request(app)
        .post('/api/v1/articles')
        .set('Authorization', 'Bearer valid-token')
        .send(articleData)
        .expect(201)

      expect(response.body).toMatchObject({
        status: 'success',
        data: {
          article: expect.objectContaining({
            title: articleData.title,
            slug: expect.any(String),
          }),
        },
      })
    })

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        content: '', // Empty content
      }

      const response = await request(app)
        .post('/api/v1/articles')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)
        .expect(400)

      expect(response.body.status).toBe('error')
      expect(response.body.errors).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/v1/articles/:slug', () => {
    it('should return article by slug', async () => {
      const response = await request(app).get('/api/v1/articles/test-article').expect(200)

      expect(response.body.data.article.slug).toBe('test-article')
    })

    it('should return 404 for non-existent article', async () => {
      await request(app).get('/api/v1/articles/non-existent-slug').expect(404)
    })
  })
})
