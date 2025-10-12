export interface PaginationQuery {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  message?: string
  pagination?: {
    current: number
    limit: number
    total: number
    pages: number
  }
}

export interface AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean
}

export interface Stats {
  articles: number
  likes?: number
  comments?: number
  followers?: number
  following?: number
}
