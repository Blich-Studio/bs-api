import { PaginationQuery } from './common'
import { UserProfile } from './profiles'

export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  author_id: string
  status: 'draft' | 'published' | 'archived'
  featured_image?: string
  tags: string[]
  read_time: number
  created_at: number
  updated_at: number
  published_at?: number
}

export interface ArticleWithRelations extends Article {
  author: UserProfile
  _count: {
    comments: number
    likes: number
  }
  liked_by_user?: boolean
}

export interface CreateArticleRequest {
  title: string
  content: string
  excerpt?: string
  featured_image?: string
  tags: string[]
  status: 'draft' | 'published'
}

export interface UpdateArticleRequest {
  title?: string
  content?: string
  excerpt?: string
  featured_image?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface ArticlesQuery extends PaginationQuery {
  tag?: string
  author?: string
  status?: ArticleStatus
  search?: string
}

export interface ArticlesResponse {
  articles: ArticleWithRelations[]
}

export interface ArticleResponse {
  article: ArticleWithRelations
}
