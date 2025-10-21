/**
 * JWT Authorization Middleware Examples
 *
 * This file provides implementation examples for JWT-based role authorization.
 * These serve as blueprints for your actual middleware implementation.
 */

import type { NextFunction, Request, Response } from 'express'

import type { AuthorizedRequest } from '@/types/authorization'
import { UserRole, rolePermissions } from '@/types/roles'

/**
 * Middleware: Verify JWT token and extract user information
 *
 * Usage: app.use(verifyJWT)
 */
export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    // No token: treat as Guest
    ;(req as AuthorizedRequest).user = undefined
    next()
    return
  }

  try {
    // TODO: Implement actual JWT verification using your JWT library
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // const user = {
    //   id: decoded.sub,
    //   email: decoded.email,
    //   role: decoded.role,
    // }

    // FIXME This JWT decoding implementation is insecure as it only decodes
    // the token without verifying the signature. An attacker can craft a
    // token with any payload. The TODO comment acknowledges this, but the
    // placeholder implementation should not be used in any production-like environment.
    // Consider adding a more explicit warning or using a library like jsonwebtoken even for the
    // placeholder.

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const buffer = require('buffer').Buffer
    const decoded = JSON.parse(buffer.from(token.split('.')[1], 'base64').toString())
    ;(req as AuthorizedRequest).user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      role: decoded.role || UserRole.Reader,
    }

    next()
  } catch {
    // Invalid token: treat as Guest
    ;(req as AuthorizedRequest).user = undefined
    next()
  }
}

/**
 * Middleware: Require authentication (must have valid JWT)
 *
 * Usage: app.get('/protected', requireAuth, controller)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthorizedRequest

  if (!authReq.user) {
    res.status(401).json({
      code: 'MISSING_TOKEN',
      message: 'Authentication required. Please provide a valid JWT token.',
    })
    return
  }

  next()
}

/**
 * Middleware: Require specific role
 *
 * Usage: app.post('/articles', requireRole(UserRole.Author), controller)
 */
export function requireRole(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthorizedRequest
    const userRole = authReq.user?.role || UserRole.Guest
    const permissions = rolePermissions[userRole]

    if (!permissions) {
      res.status(403).json({
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `Role ${userRole} is not recognized.`,
      })
      return
    }

    // Simple role check (can be enhanced with more granular permissions)
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.Guest]: 0,
      [UserRole.Reader]: 1,
      [UserRole.Author]: 2,
      [UserRole.Admin]: 3,
    }

    if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
      res.status(403).json({
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `This operation requires ${requiredRole} role or higher.`,
        requiredRole,
        userRole,
      })
      return
    }

    next()
  }
}

/**
 * Middleware: Check if user is the resource owner
 *
 * Usage: app.put('/articles/:id', requireOwnership('userId'), controller)
 */
export function requireOwnership(resourceOwnerField: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthorizedRequest

    if (!authReq.user) {
      res.status(401).json({
        code: 'MISSING_TOKEN',
        message: 'Authentication required.',
      })
      return
    }

    // Get owner ID from request body or database
    const ownerId = req.body[resourceOwnerField] || req.body.userId

    if (authReq.user.id !== ownerId) {
      res.status(403).json({
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource.',
      })
      return
    }

    next()
  }
}

/**
 * Middleware: Permission-based access control
 *
 * Usage: app.post('/articles', requirePermission('canCreateArticles'), controller)
 */
export function requirePermission(permission: keyof (typeof rolePermissions)[UserRole.Guest]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthorizedRequest
    const userRole = authReq.user?.role || UserRole.Guest
    const permissions = rolePermissions[userRole]

    if (!permissions[permission]) {
      res.status(403).json({
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `Your role (${userRole}) does not have permission for this operation.`,
        userRole,
      })
      return
    }

    next()
  }
}

/**
 * Middleware: Soft delete check (prevent hard deletes)
 *
 * Usage: app.delete('/articles/:id', preventHardDelete, controller)
 */
export function preventHardDelete(req: Request, res: Response, next: NextFunction): void {
  // No role can hard delete
  if (req.method === 'DELETE') {
    res.status(403).json({
      code: 'FORBIDDEN',
      message:
        'Hard delete is not allowed. Use soft delete by updating the resource with a deleted_at timestamp instead.',
    })
    return
  }

  next()
}

/**
 * Middleware: Allow only own profile access (unless Admin)
 *
 * Usage: app.get('/profiles/:userId', requireOwnProfile, controller)
 */
export function requireOwnProfile(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthorizedRequest
  const userRole = authReq.user?.role || UserRole.Guest

  // Admins can access any profile
  if (userRole === UserRole.Admin) {
    next()
    return
  }

  // Everyone else can only access their own
  const requestedUserId = req.params.userId
  const currentUserId = authReq.user?.id

  if (requestedUserId !== currentUserId) {
    res.status(403).json({
      code: 'FORBIDDEN',
      message: 'You can only access your own profile.',
    })
    return
  }

  next()
}

/**
 * Example route configurations using these middlewares
 */

/*
// Articles
app.get('/articles', verifyJWT, requirePermission('canGetArticles'), articlesController.list)
app.post('/articles', verifyJWT, requirePermission('canCreateArticles'), articlesController.create)
app.put('/articles/:id', verifyJWT, requirePermission('canUpdateArticles'), articlesController.update)
app.delete('/articles/:id', preventHardDelete) // Always prevents hard delete

// Comments
app.get('/articles/:id/comments', verifyJWT, requirePermission('canGetComments'), commentsController.list)
app.post('/comments', verifyJWT, requirePermission('canCreateComments'), commentsController.create)
app.put('/comments/:id', verifyJWT, requirePermission('canUpdateComments'), commentsController.update)

// Likes
app.post('/articles/:id/like', verifyJWT, requirePermission('canCreateLikes'), likesController.create)
app.put('/articles/:id/like', verifyJWT, requirePermission('canUpdateLikes'), likesController.update)

// Profiles
app.get('/profiles/:userId', verifyJWT, requireOwnProfile, profilesController.get)
app.put('/profiles/:userId', verifyJWT, requireOwnProfile, profilesController.update)
*/

/**
 * Example: Custom permission check for complex scenarios
 */
export async function checkArticleOwnership(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authReq = req as AuthorizedRequest

  if (!authReq.user) {
    res.status(401).json({
      code: 'MISSING_TOKEN',
      message: 'Authentication required.',
    })
    return
  }

  const userRole = authReq.user.role

  // Admins can modify any article
  if (userRole === UserRole.Admin) {
    next()
    return
  }

  // Authors can only modify their own articles
  if (userRole === UserRole.Author) {
    // TODO: Fetch article from database and check ownership
    // const article = await Article.findById(articleId)
    // if (article.userId !== authReq.user.id) {
    //   res.status(403).json({ code: 'FORBIDDEN', message: '...' })
    //   return
    // }
    next()
    return
  }

  // Other roles cannot modify articles
  res.status(403).json({
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Your role does not have permission to modify articles.',
  })
}

/**
 * Helper: Get user role from request
 */
export function getUserRole(req: Request): UserRole {
  const authReq = req as AuthorizedRequest
  return authReq.user?.role || UserRole.Guest
}

/**
 * Helper: Check if user has permission
 */
export function hasPermission(
  userRole: UserRole,
  permission: keyof (typeof rolePermissions)[UserRole.Guest],
): boolean {
  const perms = rolePermissions[userRole]
  return perms[permission] === true
}

/**
 * Helper: Check if user is owner
 */
export function isOwner(req: Request, resourceOwnerId: string): boolean {
  const authReq = req as AuthorizedRequest
  return authReq.user?.id === resourceOwnerId
}

/**
 * Helper: Is user admin
 */
export function isAdmin(req: Request): boolean {
  const authReq = req as AuthorizedRequest
  return authReq.user?.role === UserRole.Admin
}

/**
 * Helper: Can user modify resource (is owner or admin)
 */
export function canModifyResource(req: Request, resourceOwnerId: string): boolean {
  return isOwner(req, resourceOwnerId) || isAdmin(req)
}
