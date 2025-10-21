# JWT Role-Based Authorization Guide

This document describes the role-based access control (RBAC) system for the BS API, implemented with JWT authentication and per-endpoint authorization checks.

## Overview

The API implements four user roles with escalating permissions:

- **Guest**: Unauthenticated users (no JWT token)
- **Reader**: Registered users
- **Author**: Registered users with content creation privileges
- **Admin**: System administrators

## Role Definitions

### Guest (Unauthenticated)

**Access**: Read-only

- ✅ `GET /articles` - Read all articles
- ❌ All other endpoints require authentication

### Reader

**Access**: Read and engage with content

- ✅ `GET /articles` - Read all articles
- ✅ `GET /articles/:id/comments` - Read comments on articles
- ✅ `POST /articles/:id/comments` - Create comments
- ✅ `PUT /comments/:id` - Update own comments (ownership required)
- ✅ `POST /articles/:id/like` - Like articles
- ✅ `PUT /articles/:id/like` - Update own likes (ownership required)
- ✅ `GET /profiles/:userId` - Read own profile only (userId must match authenticated user)
- ✅ `PUT /profiles/:userId` - Update own profile (userId must match authenticated user)
- ❌ Cannot create articles
- ❌ Cannot delete any content (hard DELETE not allowed)

### Author

**Access**: Create and manage own content

Inherits all Reader permissions plus:

- ✅ `POST /articles` - Create articles
- ✅ `PUT /articles/:id` - Update own articles (ownership required)
- ✅ `POST /comments` - Create comments
- ✅ `PUT /comments/:id` - Update own comments
- ✅ `POST /likes` - Create likes
- ✅ `PUT /likes/:id` - Update own likes
- ❌ Cannot delete articles, comments, or likes (hard DELETE not allowed)
- ❌ Cannot access other author's profiles

**Note**: Content deletion uses soft-delete pattern (flag with `deleted_at` timestamp) instead of hard DELETE.

### Admin

**Access**: All operations except hard DELETE

- ✅ `GET /articles` - Read all articles
- ✅ `POST /articles` - Create articles (not limited to own)
- ✅ `PUT /articles/:id` - Update any article
- ✅ `GET /articles/:id/comments` - Read all comments
- ✅ `POST /comments` - Create comments
- ✅ `PUT /comments/:id` - Update any comment
- ✅ `GET /profiles/:userId` - Read any user profile
- ✅ `PUT /profiles/:userId` - Update any user profile
- ✅ `POST /likes`, `PUT /likes/:id` - Manage likes
- ❌ Cannot hard DELETE users, articles, comments, or likes
- ℹ️ Must use soft-delete (UPDATE with `deleted_at`) instead

## Permission Matrix

| Permission            | Guest | Reader | Author | Admin |
| --------------------- | ----- | ------ | ------ | ----- |
| GET /articles         | ✅    | ✅     | ✅     | ✅    |
| POST /articles        | ❌    | ❌     | ✅\*   | ✅    |
| PUT /articles/:id     | ❌    | ❌     | ✅\*   | ✅    |
| DELETE /articles/:id  | ❌    | ❌     | ❌     | ❌    |
| GET /comments         | ❌    | ✅     | ✅     | ✅    |
| POST /comments        | ❌    | ✅     | ✅     | ✅    |
| PUT /comments/:id     | ❌    | ✅\*   | ✅\*   | ✅    |
| DELETE /comments/:id  | ❌    | ❌     | ❌     | ❌    |
| POST /likes           | ❌    | ✅     | ✅     | ✅    |
| PUT /likes/:id        | ❌    | ✅\*   | ✅\*   | ✅    |
| DELETE /likes/:id     | ❌    | ❌     | ❌     | ❌    |
| GET /profiles/:userId | ❌    | ✅\*\* | ✅\*\* | ✅    |
| PUT /profiles/:userId | ❌    | ✅\*\* | ✅\*\* | ✅    |

\* Ownership required - user can only modify their own content
\*\* Own profile only - user can only access their own profile (except Admin)

## Implementation Details

### Type Definitions

#### UserRole Enum

```typescript
export enum UserRole {
  Guest = 'guest',
  Reader = 'reader',
  Author = 'author',
  Admin = 'admin',
}
```

#### Permission Set

```typescript
interface PermissionSet {
  canGetArticles: boolean
  canCreateArticles: boolean
  canUpdateArticles: boolean
  canDeleteArticles: boolean
  canGetComments: boolean
  canCreateComments: boolean
  canUpdateComments: boolean
  canDeleteComments: boolean
  canGetLikes: boolean
  canCreateLikes: boolean
  canUpdateLikes: boolean
  canDeleteLikes: boolean
  canGetOwnProfile: boolean
  canUpdateOwnProfile: boolean
  canGetAllProfiles: boolean
  canUpdateAllProfiles: boolean
  canDeleteUsers: boolean
}
```

#### Authorized Request

```typescript
interface AuthorizedRequest extends AuthRequest {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}
```

### Authorization Middleware Flow

```
Request
  ↓
[JWT Verification]
  ├─ Valid JWT → Extract user ID, email, role
  ├─ Invalid/Missing JWT → Treat as Guest
  ↓
[Route Handler Authorization Check]
  ├─ Check if role has permission
  ├─ Check ownership (if applicable)
  ├─ Proceed or return 403 Forbidden
  ↓
Response
```

### Ownership Verification

For operations marked with \*, ownership must be verified:

```typescript
// Example: User updating their own comment
if (req.user?.id === comment.userId) {
  // Allow update
} else {
  // Return 403 Forbidden
}
```

### Soft Delete Pattern

Instead of hard DELETE operations, resources are flagged as deleted:

```typescript
// Instead of: DELETE /articles/:id
// Use: PUT /articles/:id with soft delete flag
{
  "deleted_at": "2025-10-21T10:51:59Z"
}
```

Benefits:

- Maintains data integrity for analytics
- Allows recovery of accidentally deleted content
- Maintains foreign key relationships

## Authorization Error Codes

| Code                     | HTTP Status | Description                                   |
| ------------------------ | ----------- | --------------------------------------------- |
| MISSING_TOKEN            | 401         | No JWT token provided in Authorization header |
| INVALID_TOKEN            | 401         | JWT token is invalid, expired, or malformed   |
| INSUFFICIENT_PERMISSIONS | 403         | User role lacks required permissions          |
| FORBIDDEN                | 403         | Access to this specific resource is denied    |

## Testing

Comprehensive test suite is included:

### Unit Tests

- **File**: `src/__tests__/unit/types/roles.test.ts`
- **Coverage**: Role definitions, permission matrix, permission escalation
- **Tests**: 34 test cases

### Integration Tests

- **File**: `src/__tests__/integration/authorization.test.ts`
- **Coverage**: Endpoint authorization, ownership verification, scenarios
- **Tests**: 60 test cases

### Running Tests

```bash
# Run type tests (including roles)
npm run test:types

# Run integration tests
npm run test:integration

# Run all tests
npm run test
```

## Security Considerations

1. **JWT Validation**: All endpoints except `GET /articles` require valid JWT token
2. **Ownership Verification**: Implement ownership checks for operations marked with \*
3. **Role Escalation**: Prevent users from self-assigning higher privileges
4. **Token Expiration**: Implement token refresh mechanism for long-lived sessions
5. **HTTPS Only**: Always transmit JWT over HTTPS in production
6. **Soft Delete Auditing**: Track who deleted and when for audit logs

## Migration Guide

### From Unprotected API

If migrating from an unprotected API:

1. Add JWT validation middleware
2. Assign appropriate roles to existing users
3. Implement ownership verification
4. Update client code to include JWT in Authorization header

### Authorization Header Format

```
Authorization: Bearer <JWT_TOKEN>
```

## Troubleshooting

| Issue                         | Solution                                           |
| ----------------------------- | -------------------------------------------------- |
| Getting 401 Unauthorized      | Verify JWT token is valid and not expired          |
| Getting 403 Forbidden         | Check user role has permission for endpoint        |
| User can't access own profile | Verify userId in URL matches authenticated user ID |
| Admin can't delete            | Use soft delete (PUT with deleted_at) instead      |

## Examples

### Authenticate as Reader

```bash
curl -H "Authorization: Bearer $JWT_TOKEN" \
     https://api.example.com/articles/123/comments
```

### Create Article as Author

```bash
curl -X POST \
     -H "Authorization: Bearer $JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "My Article", ...}' \
     https://api.example.com/articles
```

### Admin Managing Users

```bash
# Get any user profile
curl -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
     https://api.example.com/profiles/user-456

# Update any user profile
curl -X PUT \
     -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
     -d '{"role": "author"}' \
     https://api.example.com/profiles/user-456
```

### Soft Delete Article

```bash
# Only admins can soft delete
curl -X PUT \
     -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"deleted_at": "2025-10-21T10:51:59Z"}' \
     https://api.example.com/articles/article-123
```

## Future Enhancements

- [ ] Fine-grained permissions (e.g., can-moderate-comments)
- [ ] Custom roles/permission assignment
- [ ] Rate limiting per role
- [ ] Audit logging for sensitive operations
- [ ] OAuth 2.0 support
- [ ] Multi-factor authentication (MFA)
- [ ] Permission delegation (temporary access)

---

**Last Updated**: October 21, 2025
**Version**: 1.0
