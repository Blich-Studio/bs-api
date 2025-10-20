/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../../app'

describe('API Validation', () => {
  describe('Article Validation', () => {
    it('should reject empty title when creating article', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: '',
          content: 'Valid content',
          tags: [],
        })
        .expect(400)

      expect(response.body.status).toBe('error')
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'body.title',
            message: 'Title is required',
          }),
        ]),
      )
    })

    it('should reject invalid status', async () => {
      // eslint-disable-next-line no-unused-vars
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Valid Title',
          content: 'Valid content',
          tags: [],
          status: 'invalid_status',
        })
        .expect(400)
    })

    it('should apply default status when not provided', async () => {
      // This tests both validation AND business logic
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Valid Title',
          content: 'Valid content',
          tags: [],
        })
        .expect(201) // Assuming your API returns 201

      expect(response.body.data.article.status).toBe('draft')
    })
  })

  describe('Comment Validation', () => {
    it('should reject empty comment content', async () => {
      const response = await request(app)
        .post('/api/v1/articles/article-123/comments')
        .send({
          content: '',
        })
        .expect(400)

      expect(response.body.errors[0].message).toContain('Content is required')
    })
  })
})
