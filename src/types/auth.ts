import { Request } from 'express'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  full_name: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken?: string
}
