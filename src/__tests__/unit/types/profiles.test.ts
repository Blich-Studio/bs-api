import { describe, it, expect } from 'vitest'

import type {
  UserProfile,
  UserProfileWithStats,
  CreateProfileRequest,
  UpdateProfileRequest,
  ProfileResponse,
} from '@/types/profiles'

describe('Profile Types', () => {
  describe('UserProfile', () => {
    it('should use epoch timestamps', () => {
      const created = Date.now() - 86400000 // 1 day ago
      const updated = Date.now()

      const profile: UserProfile = {
        id: 'user-123',
        username: 'testuser',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Software developer',
        website: 'https://example.com',
        created_at: created,
        updated_at: updated,
      }

      expect(profile.created_at).toBe(created)
      expect(profile.updated_at).toBe(updated)
      expect(typeof profile.created_at).toBe('number')
      expect(typeof profile.updated_at).toBe('number')
      expect(profile.updated_at).toBeGreaterThan(profile.created_at)
    })

    it('should allow minimal profile', () => {
      const now = Date.now()
      const profile: UserProfile = {
        id: 'user-123',
        username: 'testuser',
        full_name: 'Test User',
        created_at: now,
        updated_at: now,
      }

      expect(profile.avatar_url).toBeUndefined()
      expect(profile.bio).toBeUndefined()
      expect(profile.website).toBeUndefined()
    })

    it('should validate username format constraints', () => {
      const profile: UserProfile = {
        id: 'user-123',
        username: 'valid_user123',
        full_name: 'Test User',
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      expect(profile.username).toMatch(/^[a-zA-Z0-9_]+$/)
    })
  })

  describe('UserProfileWithStats', () => {
    it('should include comprehensive stats', () => {
      const profile: UserProfileWithStats = {
        id: 'user-123',
        username: 'testuser',
        full_name: 'Test User',
        created_at: Date.now() - 86400000,
        updated_at: Date.now(),
        stats: {
          articles: 15,
          likes_received: 120,
          comments: 45,
          followers: 10,
          following: 5,
        },
      }

      expect(profile.stats.articles).toBe(15)
      expect(profile.stats.likes_received).toBe(120)
      expect(profile.stats.followers).toBe(10)
      expect(profile.stats.following).toBe(5)
    })
  })

  describe('CreateProfileRequest', () => {
    it('should require only essential fields', () => {
      const createRequest: CreateProfileRequest = {
        username: 'newuser',
        full_name: 'New User',
      }

      expect(createRequest.username).toBe('newuser')
      expect(createRequest.full_name).toBe('New User')
      expect(createRequest.avatar_url).toBeUndefined()
    })

    it('should allow optional fields', () => {
      const createRequest: CreateProfileRequest = {
        username: 'newuser',
        full_name: 'New User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'New user bio',
        website: 'https://example.com',
      }

      expect(createRequest.bio).toBe('New user bio')
      expect(createRequest.website).toBe('https://example.com')
    })
  })

  describe('UpdateProfileRequest', () => {
    it('should allow partial updates', () => {
      const updateRequest: UpdateProfileRequest = {
        bio: 'Updated bio',
      }

      expect(updateRequest.bio).toBe('Updated bio')
      expect(updateRequest.username).toBeUndefined()
      expect(updateRequest.full_name).toBeUndefined()
    })

    it('should allow updating any field', () => {
      const updateRequest: UpdateProfileRequest = {
        username: 'updateduser',
        full_name: 'Updated Name',
        avatar_url: 'https://example.com/new-avatar.jpg',
        bio: 'Updated bio',
        website: 'https://new-example.com',
      }

      expect(updateRequest.username).toBe('updateduser')
      expect(updateRequest.avatar_url).toBe('https://example.com/new-avatar.jpg')
    })
  })

  describe('ProfileResponse', () => {
    it('should wrap profile in response format', () => {
      const response: ProfileResponse = {
        profile: {
          id: 'user-123',
          username: 'testuser',
          full_name: 'Test User',
          created_at: Date.now() - 86400000,
          updated_at: Date.now(),
          stats: {
            articles: 15,
            likes_received: 120,
            comments: 45,
          },
        },
      }

      expect(response.profile.username).toBe('testuser')
      expect(response.profile.stats.articles).toBe(15)
    })
  })
})
