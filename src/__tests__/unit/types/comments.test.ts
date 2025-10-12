import { describe, it, expect } from 'vitest'

import type {
  Comment,
  CommentWithRelations,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentsQuery,
  CommentResponse,
  CommentsResponse,
} from '@/types/comments'

describe('Comment Types', () => {
  describe('Comment', () => {
    it('should have basic comment structure with epoch timestamps', () => {
      const created = Date.now() - 3600000 // 1 hour ago
      const updated = Date.now()

      const comment: Comment = {
        id: 'comment-123',
        content: 'This is a great article!',
        article_id: 'article-123',
        author_id: 'user-123',
        created_at: created,
        updated_at: updated,
      }

      expect(comment.content).toBe('This is a great article!')
      expect(comment.article_id).toBe('article-123')
      expect(comment.author_id).toBe('user-123')
      expect(comment.created_at).toBe(created)
      expect(comment.updated_at).toBe(updated)
      expect(comment.parent_id).toBeUndefined()
    })

    it('should allow nested comments with parent_id', () => {
      const comment: Comment = {
        id: 'comment-124',
        content: 'This is a reply to the parent comment',
        article_id: 'article-123',
        author_id: 'user-124',
        parent_id: 'comment-123',
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      expect(comment.parent_id).toBe('comment-123')
    })
  })

  describe('CommentWithRelations', () => {
    it('should include author information', () => {
      const comment: CommentWithRelations = {
        id: 'comment-123',
        content: 'Comment with author',
        article_id: 'article-123',
        author_id: 'user-123',
        created_at: Date.now(),
        updated_at: Date.now(),
        author: {
          id: 'user-123',
          username: 'commenter',
          full_name: 'Comment Author',
          created_at: Date.now() - 86400000,
          updated_at: Date.now(),
        },
      }

      expect(comment.author.username).toBe('commenter')
      expect(comment.author.full_name).toBe('Comment Author')
    })

    it('should include nested replies', () => {
      const comment: CommentWithRelations = {
        id: 'comment-123',
        content: 'Parent comment',
        article_id: 'article-123',
        author_id: 'user-123',
        created_at: Date.now(),
        updated_at: Date.now(),
        author: {
          id: 'user-123',
          username: 'parentuser',
          full_name: 'Parent User',
          created_at: Date.now() - 86400000,
          updated_at: Date.now(),
        },
        replies: [
          {
            id: 'comment-124',
            content: 'First reply',
            article_id: 'article-123',
            author_id: 'user-124',
            parent_id: 'comment-123',
            created_at: Date.now() + 1000,
            updated_at: Date.now() + 1000,
            author: {
              id: 'user-124',
              username: 'replyuser',
              full_name: 'Reply User',
              created_at: Date.now() - 43200000,
              updated_at: Date.now(),
            },
          },
        ],
        _count: {
          replies: 1,
        },
      }

      expect(comment.replies).toHaveLength(1)
      expect(comment.replies![0].content).toBe('First reply')
      expect(comment._count!.replies).toBe(1)
    })
  })

  describe('CreateCommentRequest', () => {
    it('should require only content', () => {
      const createRequest: CreateCommentRequest = {
        content: 'New comment content',
      }

      expect(createRequest.content).toBe('New comment content')
      expect(createRequest.parent_id).toBeUndefined()
    })

    it('should allow creating nested comments', () => {
      const createRequest: CreateCommentRequest = {
        content: 'Reply comment',
        parent_id: 'parent-comment-123',
      }

      expect(createRequest.parent_id).toBe('parent-comment-123')
    })
  })

  describe('UpdateCommentRequest', () => {
    it('should only allow updating content', () => {
      const updateRequest: UpdateCommentRequest = {
        content: 'Updated comment content',
      }

      expect(updateRequest.content).toBe('Updated comment content')
      // Should not allow updating other fields
      expect(Object.keys(updateRequest)).toEqual(['content'])
    })
  })

  describe('CommentsQuery', () => {
    it('should allow pagination and reply inclusion', () => {
      const query: CommentsQuery = {
        page: 1,
        limit: 50,
        include_replies: true,
      }

      expect(query.include_replies).toBe(true)
      expect(query.page).toBe(1)
      expect(query.limit).toBe(50)
    })

    it('should default to not including replies', () => {
      const query: CommentsQuery = {
        page: 1,
      }

      expect(query.include_replies).toBeUndefined()
    })
  })

  describe('CommentResponse and CommentsResponse', () => {
    it('should wrap single comment in response', () => {
      const response: CommentResponse = {
        comment: {
          id: 'comment-123',
          content: 'Test comment',
          article_id: 'article-123',
          author_id: 'user-123',
          created_at: Date.now(),
          updated_at: Date.now(),
          author: {
            id: 'user-123',
            username: 'testuser',
            full_name: 'Test User',
            created_at: Date.now() - 86400000,
            updated_at: Date.now(),
          },
        },
      }

      expect(response.comment.content).toBe('Test comment')
      expect(response.comment.author.username).toBe('testuser')
    })

    it('should wrap multiple comments in response', () => {
      const response: CommentsResponse = {
        comments: [
          {
            id: 'comment-123',
            content: 'First comment',
            article_id: 'article-123',
            author_id: 'user-123',
            created_at: Date.now(),
            updated_at: Date.now(),
            author: {
              id: 'user-123',
              username: 'user1',
              full_name: 'User One',
              created_at: Date.now() - 86400000,
              updated_at: Date.now(),
            },
          },
          {
            id: 'comment-124',
            content: 'Second comment',
            article_id: 'article-123',
            author_id: 'user-124',
            created_at: Date.now() + 1000,
            updated_at: Date.now() + 1000,
            author: {
              id: 'user-124',
              username: 'user2',
              full_name: 'User Two',
              created_at: Date.now() - 43200000,
              updated_at: Date.now(),
            },
          },
        ],
      }

      expect(response.comments).toHaveLength(2)
      expect(response.comments[0].content).toBe('First comment')
      expect(response.comments[1].content).toBe('Second comment')
    })
  })
})
