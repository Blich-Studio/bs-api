// src/__tests__/utils/test-data.ts
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  username: 'testuser',
  full_name: 'Test User',
}

export const mockArticle = {
  id: 'article-123',
  title: 'Test Article',
  content: 'Test content',
  slug: 'test-article',
  author_id: 'user-123',
  status: 'published' as const,
}

export const mockComment = {
  id: 'comment-123',
  content: 'Test comment',
  article_id: 'article-123',
  author_id: 'user-123',
}
