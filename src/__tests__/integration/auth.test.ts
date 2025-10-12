import { describe, it, expect, vi, beforeAll } from 'vitest'
import request from 'supertest'

import { supabase } from '../../lib/supabase'

import app from '@/app'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}))

describe('Authentication Middleware', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  }

  beforeAll(() => {
    // Setup mock routes for testing auth
    app.get('/api/v1/protected', (req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.json({ message: 'protected', user: (req as any).user })
    })
  })

  it('should return 401 without authorization header', async () => {
    await request(app)
      .get('/api/v1/protected')
      .expect(401)
      .expect((res) => {
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe('No token provided')
      })
  })

  it('should return 401 with invalid token', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: new Error('Invalid token'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    await request(app)
      .get('/api/v1/protected')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401)
      .expect((res) => {
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe('Invalid token')
      })
  })

  it('should allow access with valid token', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    await request(app)
      .get('/api/v1/protected')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.user).toEqual(mockUser)
      })
  })
})
