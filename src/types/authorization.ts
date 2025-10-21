import type { AuthRequest } from './auth'
import { UserRole } from './roles'

/**
 * Extended auth request with user role information
 */
export interface AuthorizedRequest extends AuthRequest {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

/**
 * Represents an authorization error with specific details
 */
export interface AuthorizationError {
  code: 'MISSING_TOKEN' | 'INVALID_TOKEN' | 'INSUFFICIENT_PERMISSIONS' | 'FORBIDDEN'
  message: string
  requiredRole?: UserRole
  userRole?: UserRole
}

/**
 * Resource ownership check function
 * Returns true if the user owns/can modify the resource
 */
export type OwnershipCheck = (_req: AuthorizedRequest, _resourceOwnerId: string) => Promise<boolean>
