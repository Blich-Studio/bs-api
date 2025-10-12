import { describe, it, expect } from 'vitest'

import type { PaginationQuery, ApiResponse, AppError, Stats } from '@/types/common'

describe('Common Types', () => {
  describe('Timestamp', () => {
    it('should be a number representing epoch time', () => {
      const now = Date.now()
      const specificTime = 1704067200000 // 2024-01-01

      expect(typeof now).toBe('number')
      expect(typeof specificTime).toBe('number')
      expect(now).toBeGreaterThan(0)
      expect(specificTime).toBe(1704067200000)
    })

    it('should work with Date methods', () => {
      const timestamp = 1704067200000
      const date = new Date(timestamp)

      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(0) // January
      expect(date.getDate()).toBe(1)
    })
  })

  describe('PaginationQuery', () => {
    it('should allow valid pagination parameters', () => {
      const pagination: PaginationQuery = {
        page: 1,
        limit: 10,
        sort: 'created_at',
        order: 'desc',
      }

      expect(pagination.page).toBe(1)
      expect(pagination.limit).toBe(10)
      expect(pagination.sort).toBe('created_at')
      expect(pagination.order).toBe('desc')
    })

    it('should allow order to be only asc or desc', () => {
      const ascending: PaginationQuery = { order: 'asc' }
      const descending: PaginationQuery = { order: 'desc' }

      expect(ascending.order).toBe('asc')
      expect(descending.order).toBe('desc')
    })
  })

  describe('ApiResponse', () => {
    it('should allow success response with timestamp', () => {
      const response: ApiResponse<{ id: string }> = {
        status: 'success',
        data: { id: '123' },
        timestamp: Date.now(),
      }

      expect(response.status).toBe('success')
      expect(response.timestamp).toBeGreaterThan(0)
      expect(typeof response.timestamp).toBe('number')
    })

    it('should allow error response with timestamp', () => {
      const response: ApiResponse = {
        status: 'error',
        message: 'Not found',
        timestamp: 1704067200000,
      }

      expect(response.status).toBe('error')
      expect(response.timestamp).toBe(1704067200000)
    })
  })

  describe('AppError', () => {
    it('should include timestamp', () => {
      const error: AppError = {
        name: 'AppError',
        message: 'Validation failed',
        statusCode: 400,
        status: 'error',
        isOperational: true,
        timestamp: Date.now(),
      }

      expect(error.timestamp).toBeGreaterThan(0)
      expect(error.statusCode).toBe(400)
    })
  })

  describe('Stats', () => {
    it('should track various metrics', () => {
      const stats: Stats = {
        articles: 15,
        likes: 120,
        comments: 45,
        followers: 10,
        following: 5,
      }

      expect(stats.articles).toBe(15)
      expect(stats.likes).toBe(120)
      expect(stats.comments).toBe(45)
      expect(stats.followers).toBe(10)
      expect(stats.following).toBe(5)
    })
  })
})
