/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'

import { validate } from '@/middleware/validation'
import { createArticleSchema } from '@/schemas/article.schema'

describe('Validation Middleware', () => {
  it('should call next() for valid data', async () => {
    const req = {
      body: { title: 'Test', content: 'Content', tags: [] },
      query: {},
      params: {},
    }
    const res = {}
    const next = vi.fn()

    const middleware = validate(createArticleSchema)
    await middleware(req as any, res as any, next)

    expect(next).toHaveBeenCalled()
  })

  it('should return 400 for invalid data', async () => {
    const req = {
      body: { title: '', content: 'Content', tags: [] }, // Invalid: empty title
      query: {},
      params: {},
    }
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    const next = vi.fn()

    const middleware = validate(createArticleSchema)
    await middleware(req as any, res as any, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})
