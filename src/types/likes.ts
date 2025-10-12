export interface Like {
  id: string
  article_id: string
  user_id: string
  created_at: number
}

export interface LikeWithUser extends Like {
  user: {
    username: string
    full_name: string
    avatar_url?: string
  }
}

export interface LikeResponse {
  like: Like
}

export interface LikesResponse {
  likes: LikeWithUser[]
}

export interface LikeStatus {
  liked: boolean
  like_count: number
}
