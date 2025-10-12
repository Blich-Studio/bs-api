import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock environment variables
  vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co')
  vi.stubEnv('SUPABASE_ANON_KEY', 'test-key')
})

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.unstubAllEnvs()
})
