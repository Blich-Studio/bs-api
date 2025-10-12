import { Stats } from './common'

export interface UserProfile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  website?: string
  created_at: number
  updated_at?: number
}

export interface UserProfileWithStats extends UserProfile {
  stats: Stats
}

export interface CreateProfileRequest {
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  website?: string
}

export interface UpdateProfileRequest {
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  website?: string
}

export interface ProfileResponse {
  profile: UserProfileWithStats
}
