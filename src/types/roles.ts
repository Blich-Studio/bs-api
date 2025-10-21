/**
 * User role enumeration for role-based access control
 */
export enum UserRole {
  /**
   * Non-registered user - can read articles only
   */
  Guest = 'guest',

  /**
   * Registered user - can read, comment, like articles and manage own profile
   */
  Reader = 'reader',

  /**
   * Registered user with author privileges - can create and manage own articles
   */
  Author = 'author',

  /**
   * Administrator - can perform all operations except DELETE
   */
  Admin = 'admin',
}

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

/**
 * Role-based permission matrix
 * Defines which roles can perform which operations on which resources
 */
export const rolePermissions: Record<UserRole, PermissionSet> = {
  [UserRole.Guest]: {
    canGetArticles: true,
    canCreateArticles: false,
    canUpdateArticles: false,
    canDeleteArticles: false,
    canGetComments: false,
    canCreateComments: false,
    canUpdateComments: false,
    canDeleteComments: false,
    canGetLikes: false,
    canCreateLikes: false,
    canUpdateLikes: false,
    canDeleteLikes: false,
    canGetOwnProfile: false,
    canUpdateOwnProfile: false,
    canGetAllProfiles: false,
    canUpdateAllProfiles: false,
    canDeleteUsers: false,
  },
  [UserRole.Reader]: {
    canGetArticles: true,
    canCreateArticles: false,
    canUpdateArticles: false,
    canDeleteArticles: false,
    canGetComments: true,
    canCreateComments: true,
    canUpdateComments: true,
    canDeleteComments: false,
    canGetLikes: true,
    canCreateLikes: true,
    canUpdateLikes: true,
    canDeleteLikes: false,
    canGetOwnProfile: true,
    canUpdateOwnProfile: true,
    canGetAllProfiles: false,
    canUpdateAllProfiles: false,
    canDeleteUsers: false,
  },
  [UserRole.Author]: {
    canGetArticles: true,
    canCreateArticles: true,
    canUpdateArticles: true,
    canDeleteArticles: false,
    canGetComments: true,
    canCreateComments: true,
    canUpdateComments: true,
    canDeleteComments: false,
    canGetLikes: true,
    canCreateLikes: true,
    canUpdateLikes: true,
    canDeleteLikes: false,
    canGetOwnProfile: true,
    canUpdateOwnProfile: true,
    canGetAllProfiles: false,
    canUpdateAllProfiles: false,
    canDeleteUsers: false,
  },
  [UserRole.Admin]: {
    canGetArticles: true,
    canCreateArticles: true,
    canUpdateArticles: true,
    canDeleteArticles: false, // Admins flag as deleted instead
    canGetComments: true,
    canCreateComments: true,
    canUpdateComments: true,
    canDeleteComments: false, // Flag as deleted instead
    canGetLikes: true,
    canCreateLikes: true,
    canUpdateLikes: true,
    canDeleteLikes: false, // Flag as deleted instead
    canGetOwnProfile: true,
    canUpdateOwnProfile: true,
    canGetAllProfiles: true,
    canUpdateAllProfiles: true,
    canDeleteUsers: false, // Flag users as deleted instead
  },
}
