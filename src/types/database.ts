/* eslint-disable no-unused-vars */
import { UserProfile } from './profiles'
import { Article } from './articles'
import { Comment } from './comments'
import { Like } from './likes'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
      articles: {
        Row: Article
        Insert: Omit<
          Article,
          'id' | 'created_at' | 'updated_at' | 'published_at' | 'slug' | 'read_time'
        >
        Update: Partial<Omit<Article, 'id' | 'created_at' | 'author_id'>>
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'author_id' | 'article_id'>>
      }
      likes: {
        Row: Like
        Insert: Omit<Like, 'id' | 'created_at'>
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
