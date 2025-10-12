import { describe, it, expect } from 'vitest'

import type {
  Article,
  ArticleWithRelations,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticlesQuery,
  ArticleResponse,
  ArticlesResponse,
  ArticleStatus,
} from '@/types/articles'

describe('Article Types', () => {
  describe('ArticleStatus', () => {
    it('should allow only valid status values', () => {
      const draft: ArticleStatus = 'draft'
      const published: ArticleStatus = 'published'
      const archived: ArticleStatus = 'archived'

      expect(draft).toBe('draft')
      expect(published).toBe('published')
      expect(archived).toBe('archived')
    })
  })

  describe('Article', () => {
    it('should have complete article structure with epoch timestamps', () => {
      const created = Date.now() - 86400000
      const updated = Date.now()
      const published = Date.now() - 43200000 // 12 hours ago

      const article: Article = {
        id: 'article-123',
        title: 'Test Article Title',
        content: 'This is the full article content...',
        excerpt: 'This is a short excerpt...',
        slug: 'test-article-title',
        author_id: 'user-123',
        status: 'published',
        featured_image: 'https://example.com/image.jpg',
        tags: ['typescript', 'testing', 'nodejs'],
        read_time: 5,
        created_at: created,
        updated_at: updated,
        published_at: published,
      }

      expect(article.created_at).toBe(created)
      expect(article.updated_at).toBe(updated)
      expect(article.published_at).toBe(published)
      expect(article.read_time).toBe(5)
      expect(article.tags).toEqual(['typescript', 'testing', 'nodejs'])
    })

    it('should allow draft articles without published_at', () => {
      const article: Article = {
        id: 'article-123',
        title: 'Draft Article',
        content: 'Draft content...',
        excerpt: 'Draft excerpt...',
        slug: 'draft-article',
        author_id: 'user-123',
        status: 'draft',
        tags: [],
        read_time: 2,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      expect(article.status).toBe('draft')
      expect(article.published_at).toBeUndefined()
    })

    it('should allow articles without featured image', () => {
      const article: Article = {
        id: 'article-123',
        title: 'No Image Article',
        content: 'Content without image...',
        excerpt: 'Excerpt without image...',
        slug: 'no-image-article',
        author_id: 'user-123',
        status: 'published',
        tags: ['test'],
        read_time: 3,
        created_at: Date.now(),
        updated_at: Date.now(),
        published_at: Date.now(),
      }

      expect(article.featured_image).toBeUndefined()
    })
  })

  describe('ArticleWithRelations', () => {
    it('should include author and counts', () => {
      const article: ArticleWithRelations = {
        id: 'article-123',
        title: 'Test Article',
        content: 'Content...',
        excerpt: 'Excerpt...',
        slug: 'test-article',
        author_id: 'user-123',
        status: 'published',
        tags: ['test'],
        read_time: 4,
        created_at: Date.now(),
        updated_at: Date.now(),
        published_at: Date.now(),
        author: {
          id: 'user-123',
          username: 'testuser',
          full_name: 'Test User',
          created_at: Date.now() - 86400000,
          updated_at: Date.now(),
        },
        _count: {
          comments: 15,
          likes: 42,
        },
        liked_by_user: true,
      }

      expect(article.author.username).toBe('testuser')
      expect(article._count.comments).toBe(15)
      expect(article._count.likes).toBe(42)
      expect(article.liked_by_user).toBe(true)
    })

    it('should handle not liked by user', () => {
      const article: ArticleWithRelations = {
        id: 'article-123',
        title: 'Test Article',
        content: 'Content...',
        excerpt: 'Excerpt...',
        slug: 'test-article',
        author_id: 'user-123',
        status: 'published',
        tags: ['test'],
        read_time: 4,
        created_at: Date.now(),
        updated_at: Date.now(),
        published_at: Date.now(),
        author: {
          id: 'user-123',
          username: 'testuser',
          full_name: 'Test User',
          created_at: Date.now() - 86400000,
          updated_at: Date.now(),
        },
        _count: {
          comments: 0,
          likes: 0,
        },
        liked_by_user: false,
      }

      expect(article.liked_by_user).toBe(false)
      expect(article._count.likes).toBe(0)
    })
  })

  describe('CreateArticleRequest', () => {
    it('should require title and content', () => {
      const createRequest: CreateArticleRequest = {
        title: 'New Article',
        content: 'Article content...',
        tags: ['new'],
        status: 'draft',
      }

      expect(createRequest.title).toBe('New Article')
      expect(createRequest.content).toBe('Article content...')
      expect(createRequest.excerpt).toBeUndefined()
    })

    it('should allow optional excerpt and featured image', () => {
      const createRequest: CreateArticleRequest = {
        title: 'New Article',
        content: 'Article content...',
        excerpt: 'Custom excerpt...',
        featured_image: 'https://example.com/image.jpg',
        tags: [],
        status: 'published',
      }

      expect(createRequest.excerpt).toBe('Custom excerpt...')
      expect(createRequest.featured_image).toBe('https://example.com/image.jpg')
      expect(createRequest.status).toBe('published')
    })
  })

  describe('UpdateArticleRequest', () => {
    it('should allow partial updates', () => {
      const updateRequest: UpdateArticleRequest = {
        title: 'Updated Title',
        status: 'published',
      }

      expect(updateRequest.title).toBe('Updated Title')
      expect(updateRequest.status).toBe('published')
      expect(updateRequest.content).toBeUndefined()
    })

    it('should allow updating tags array', () => {
      const updateRequest: UpdateArticleRequest = {
        tags: ['updated', 'tags'],
      }

      expect(updateRequest.tags).toEqual(['updated', 'tags'])
    })
  })

  describe('ArticlesQuery', () => {
    it('should allow filtering by various criteria', () => {
      const query: ArticlesQuery = {
        page: 2,
        limit: 20,
        sort: 'published_at',
        order: 'desc',
        tag: 'typescript',
        author: 'user-123',
        status: 'published',
        search: 'test query',
      }

      expect(query.tag).toBe('typescript')
      expect(query.author).toBe('user-123')
      expect(query.status).toBe('published')
      expect(query.search).toBe('test query')
      expect(query.page).toBe(2)
      expect(query.limit).toBe(20)
    })

    it('should allow minimal query', () => {
      const query: ArticlesQuery = {}

      expect(query.page).toBeUndefined()
      expect(query.tag).toBeUndefined()
      expect(query.status).toBeUndefined()
    })
  })

  describe('ArticleResponse and ArticlesResponse', () => {
    it('should wrap single article in response', () => {
      const response: ArticleResponse = {
        article: {
          id: 'article-123',
          title: 'Test Article',
          content: 'Content...',
          excerpt: 'Excerpt...',
          slug: 'test-article',
          author_id: 'user-123',
          status: 'published',
          tags: ['test'],
          read_time: 4,
          created_at: Date.now(),
          updated_at: Date.now(),
          published_at: Date.now(),
          author: {
            id: 'user-123',
            username: 'testuser',
            full_name: 'Test User',
            created_at: Date.now() - 86400000,
            updated_at: Date.now(),
          },
          _count: {
            comments: 5,
            likes: 10,
          },
          liked_by_user: false,
        },
      }

      expect(response.article.title).toBe('Test Article')
      expect(response.article._count.comments).toBe(5)
    })

    it('should wrap multiple articles in response', () => {
      const response: ArticlesResponse = {
        articles: [
          {
            id: 'article-1',
            title: 'First Article',
            content: 'Content 1...',
            excerpt: 'Excerpt 1...',
            slug: 'first-article',
            author_id: 'user-123',
            status: 'published',
            tags: ['first'],
            read_time: 3,
            created_at: Date.now(),
            updated_at: Date.now(),
            published_at: Date.now(),
            author: {
              id: 'user-123',
              username: 'testuser',
              full_name: 'Test User',
              created_at: Date.now() - 86400000,
              updated_at: Date.now(),
            },
            _count: {
              comments: 2,
              likes: 5,
            },
            liked_by_user: true,
          },
        ],
      }

      expect(response.articles).toHaveLength(1)
      expect(response.articles[0].title).toBe('First Article')
    })
  })
})
