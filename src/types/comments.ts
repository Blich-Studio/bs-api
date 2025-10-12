import { PaginationQuery } from './common'
import { UserProfile } from './profiles'

export interface Comment {
  id: string
  content: string
  article_id: string
  author_id: string
  parent_id?: string
  created_at: number
  updated_at: number
}

export interface CommentWithRelations extends Comment {
  author: UserProfile
  replies?: CommentWithRelations[]
  _count?: {
    replies: number
  }
}

export interface CreateCommentRequest {
  content: string
  parent_id?: string
}

export interface UpdateCommentRequest {
  content: string
}

export interface CommentsQuery extends PaginationQuery {
  include_replies?: boolean
}

export interface CommentsResponse {
  comments: CommentWithRelations[]
}

export interface CommentResponse {
  comment: CommentWithRelations
}
