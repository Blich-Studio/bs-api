import { describe, it, expect } from 'vitest'

import type { Like, LikeWithUser, LikeResponse, LikesResponse, LikeStatus } from '@/types/likes'

describe('Like Types', () => {
  describe('Like', () => {
    it('should have basic like structure with epoch timestamp', () => {
      const likedAt = Date.now() - 1800000 // 30 minutes ago

      const like: Like = {
        id: 'like-123',
        article_id: 'article-123',
        user_id: 'user-123',
        created_at: likedAt,
      }

      expect(like.article_id).toBe('article-123')
      expect(like.user_id).toBe('user-123')
      expect(like.created_at).toBe(likedAt)
      expect(typeof like.created_at).toBe('number')
    })

    it('should represent unique user-article combination', () => {
      const like: Like = {
        id: 'like-123',
        article_id: 'specific-article',
        user_id: 'specific-user',
        created_at: Date.now(),
      }

      expect(like.article_id).toBe('specific-article')
      expect(like.user_id).toBe('specific-user')
    })
  })

  describe('LikeWithUser', () => {
    it('should include user profile information', () => {
      const like: LikeWithUser = {
        id: 'like-123',
        article_id: 'article-123',
        user_id: 'user-123',
        created_at: Date.now(),
        user: {
          username: 'likeruser',
          full_name: 'Liker User',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      }

      expect(like.user.username).toBe('likeruser')
      expect(like.user.full_name).toBe('Liker User')
      expect(like.user.avatar_url).toBe('https://example.com/avatar.jpg')
    })

    it('should work without avatar URL', () => {
      const like: LikeWithUser = {
        id: 'like-123',
        article_id: 'article-123',
        user_id: 'user-123',
        created_at: Date.now(),
        user: {
          username: 'simpleuser',
          full_name: 'Simple User',
        },
      }

      expect(like.user.avatar_url).toBeUndefined()
    })
  })

  describe('LikeResponse', () => {
    it('should wrap single like in response', () => {
      const response: LikeResponse = {
        like: {
          id: 'like-123',
          article_id: 'article-123',
          user_id: 'user-123',
          created_at: Date.now(),
        },
      }

      expect(response.like.id).toBe('like-123')
      expect(response.like.article_id).toBe('article-123')
    })
  })

  describe('LikesResponse', () => {
    it('should wrap multiple likes with user info', () => {
      const response: LikesResponse = {
        likes: [
          {
            id: 'like-123',
            article_id: 'article-123',
            user_id: 'user-123',
            created_at: Date.now(),
            user: {
              username: 'user1',
              full_name: 'User One',
            },
          },
          {
            id: 'like-124',
            article_id: 'article-123',
            user_id: 'user-124',
            created_at: Date.now() + 1000,
            user: {
              username: 'user2',
              full_name: 'User Two',
              avatar_url: 'https://example.com/avatar2.jpg',
            },
          },
        ],
      }

      expect(response.likes).toHaveLength(2)
      expect(response.likes[0].user.username).toBe('user1')
      expect(response.likes[1].user.username).toBe('user2')
    })
  })

  describe('LikeStatus', () => {
    it('should indicate like state and count', () => {
      const status: LikeStatus = {
        liked: true,
        like_count: 42,
      }

      expect(status.liked).toBe(true)
      expect(status.like_count).toBe(42)
    })

    it('should handle not liked status', () => {
      const status: LikeStatus = {
        liked: false,
        like_count: 15,
      }

      expect(status.liked).toBe(false)
      expect(status.like_count).toBe(15)
    })

    it('should handle zero likes', () => {
      const status: LikeStatus = {
        liked: false,
        like_count: 0,
      }

      expect(status.liked).toBe(false)
      expect(status.like_count).toBe(0)
    })
  })
})
