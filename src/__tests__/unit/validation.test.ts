// src/__tests__/unit/validation.test.ts
import { describe, it, expect } from 'vitest'

import { createArticleSchema } from '../../schemas/article.schema'

describe('Article Validation', () => {
  it('should validate correct article data', async () => {
    const validData = {
      body: {
        title: 'Valid Title',
        content: 'Valid content here',
        excerpt: 'Valid excerpt',
        tags: ['typescript', 'nodejs'],
        status: 'draft',
      },
    }

    const result = await createArticleSchema.safeParseAsync(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty title', async () => {
    const invalidData = {
      body: {
        title: '',
        content: 'Some content',
        tags: [],
      },
    }

    const result = await createArticleSchema.safeParseAsync(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid status', async () => {
    const invalidData = {
      body: {
        title: 'Test Title',
        content: 'Test content',
        status: 'invalid_status',
      },
    }

    const result = await createArticleSchema.safeParseAsync(invalidData)
    expect(result.success).toBe(false)
  })
})
