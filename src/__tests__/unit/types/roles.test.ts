import { describe, it, expect } from 'vitest'

import { UserRole, rolePermissions } from '@/types/roles'

describe('UserRole Enum', () => {
  describe('Role values', () => {
    it('should have Guest role', () => {
      expect(UserRole.Guest).toBe('guest')
    })

    it('should have Reader role', () => {
      expect(UserRole.Reader).toBe('reader')
    })

    it('should have Author role', () => {
      expect(UserRole.Author).toBe('author')
    })

    it('should have Admin role', () => {
      expect(UserRole.Admin).toBe('admin')
    })
  })

  describe('Role permissions - Guest', () => {
    it('should allow reading articles', () => {
      expect(rolePermissions[UserRole.Guest].canGetArticles).toBe(true)
    })

    it('should deny creating articles', () => {
      expect(rolePermissions[UserRole.Guest].canCreateArticles).toBe(false)
    })

    it('should deny all other create/update operations', () => {
      expect(rolePermissions[UserRole.Guest].canCreateComments).toBe(false)
      expect(rolePermissions[UserRole.Guest].canCreateLikes).toBe(false)
      expect(rolePermissions[UserRole.Guest].canUpdateOwnProfile).toBe(false)
    })

    it('should deny accessing profiles', () => {
      expect(rolePermissions[UserRole.Guest].canGetOwnProfile).toBe(false)
      expect(rolePermissions[UserRole.Guest].canGetAllProfiles).toBe(false)
    })

    it('should deny all delete operations', () => {
      expect(rolePermissions[UserRole.Guest].canDeleteArticles).toBe(false)
      expect(rolePermissions[UserRole.Guest].canDeleteComments).toBe(false)
      expect(rolePermissions[UserRole.Guest].canDeleteLikes).toBe(false)
    })
  })

  describe('Role permissions - Reader', () => {
    it('should allow reading articles', () => {
      expect(rolePermissions[UserRole.Reader].canGetArticles).toBe(true)
    })

    it('should deny creating articles', () => {
      expect(rolePermissions[UserRole.Reader].canCreateArticles).toBe(false)
    })

    it('should allow creating comments', () => {
      expect(rolePermissions[UserRole.Reader].canCreateComments).toBe(true)
    })

    it('should allow creating likes', () => {
      expect(rolePermissions[UserRole.Reader].canCreateLikes).toBe(true)
    })

    it('should allow updating own comments and likes', () => {
      expect(rolePermissions[UserRole.Reader].canUpdateComments).toBe(true)
      expect(rolePermissions[UserRole.Reader].canUpdateLikes).toBe(true)
    })

    it('should allow accessing own profile only', () => {
      expect(rolePermissions[UserRole.Reader].canGetOwnProfile).toBe(true)
      expect(rolePermissions[UserRole.Reader].canUpdateOwnProfile).toBe(true)
      expect(rolePermissions[UserRole.Reader].canGetAllProfiles).toBe(false)
      expect(rolePermissions[UserRole.Reader].canUpdateAllProfiles).toBe(false)
    })

    it('should deny all delete operations', () => {
      expect(rolePermissions[UserRole.Reader].canDeleteArticles).toBe(false)
      expect(rolePermissions[UserRole.Reader].canDeleteComments).toBe(false)
      expect(rolePermissions[UserRole.Reader].canDeleteLikes).toBe(false)
    })
  })

  describe('Role permissions - Author', () => {
    it('should allow reading and creating articles', () => {
      expect(rolePermissions[UserRole.Author].canGetArticles).toBe(true)
      expect(rolePermissions[UserRole.Author].canCreateArticles).toBe(true)
    })

    it('should allow updating articles', () => {
      expect(rolePermissions[UserRole.Author].canUpdateArticles).toBe(true)
    })

    it('should allow creating and updating comments', () => {
      expect(rolePermissions[UserRole.Author].canCreateComments).toBe(true)
      expect(rolePermissions[UserRole.Author].canUpdateComments).toBe(true)
    })

    it('should allow creating and updating likes', () => {
      expect(rolePermissions[UserRole.Author].canCreateLikes).toBe(true)
      expect(rolePermissions[UserRole.Author].canUpdateLikes).toBe(true)
    })

    it('should allow accessing own profile only', () => {
      expect(rolePermissions[UserRole.Author].canGetOwnProfile).toBe(true)
      expect(rolePermissions[UserRole.Author].canUpdateOwnProfile).toBe(true)
      expect(rolePermissions[UserRole.Author].canGetAllProfiles).toBe(false)
      expect(rolePermissions[UserRole.Author].canUpdateAllProfiles).toBe(false)
    })

    it('should deny all delete operations (use soft delete instead)', () => {
      expect(rolePermissions[UserRole.Author].canDeleteArticles).toBe(false)
      expect(rolePermissions[UserRole.Author].canDeleteComments).toBe(false)
      expect(rolePermissions[UserRole.Author].canDeleteLikes).toBe(false)
    })
  })

  describe('Role permissions - Admin', () => {
    it('should allow all read operations', () => {
      expect(rolePermissions[UserRole.Admin].canGetArticles).toBe(true)
      expect(rolePermissions[UserRole.Admin].canGetOwnProfile).toBe(true)
      expect(rolePermissions[UserRole.Admin].canGetAllProfiles).toBe(true)
    })

    it('should allow all create operations', () => {
      expect(rolePermissions[UserRole.Admin].canCreateArticles).toBe(true)
      expect(rolePermissions[UserRole.Admin].canCreateComments).toBe(true)
      expect(rolePermissions[UserRole.Admin].canCreateLikes).toBe(true)
    })

    it('should allow all update operations', () => {
      expect(rolePermissions[UserRole.Admin].canUpdateArticles).toBe(true)
      expect(rolePermissions[UserRole.Admin].canUpdateComments).toBe(true)
      expect(rolePermissions[UserRole.Admin].canUpdateLikes).toBe(true)
      expect(rolePermissions[UserRole.Admin].canUpdateAllProfiles).toBe(true)
    })

    it('should deny all DELETE operations (use soft delete/flagging instead)', () => {
      expect(rolePermissions[UserRole.Admin].canDeleteArticles).toBe(false)
      expect(rolePermissions[UserRole.Admin].canDeleteComments).toBe(false)
      expect(rolePermissions[UserRole.Admin].canDeleteLikes).toBe(false)
      expect(rolePermissions[UserRole.Admin].canDeleteUsers).toBe(false)
    })

    it('should have complete access except DELETE', () => {
      const adminPerms = rolePermissions[UserRole.Admin]
      const deletePerms = Object.entries(adminPerms)
        .filter(([key]) => key.startsWith('canDelete'))
        .map(([, value]) => value)

      expect(deletePerms).toEqual([false, false, false, false])
    })
  })

  describe('Permission matrix consistency', () => {
    it('should define permissions for all roles', () => {
      const definedRoles = Object.keys(rolePermissions)
      const enumRoles = Object.values(UserRole)

      expect(definedRoles.length).toBe(enumRoles.length)
    })

    it('should have consistent permission structure for all roles', () => {
      const roles = Object.values(UserRole)
      const expectedKeys = [
        'canGetArticles',
        'canCreateArticles',
        'canUpdateArticles',
        'canDeleteArticles',
        'canGetComments',
        'canCreateComments',
        'canUpdateComments',
        'canDeleteComments',
        'canGetLikes',
        'canCreateLikes',
        'canUpdateLikes',
        'canDeleteLikes',
        'canGetOwnProfile',
        'canUpdateOwnProfile',
        'canGetAllProfiles',
        'canUpdateAllProfiles',
        'canDeleteUsers',
      ]

      roles.forEach((role) => {
        const actualKeys = Object.keys(rolePermissions[role]).sort()
        const sortedExpected = expectedKeys.sort()

        expect(actualKeys).toEqual(sortedExpected)
      })
    })

    it('all permissions should be boolean values', () => {
      const roles = Object.values(UserRole)

      roles.forEach((role) => {
        const perms = rolePermissions[role]
        Object.values(perms).forEach((value) => {
          expect(typeof value).toBe('boolean')
        })
      })
    })
  })

  describe('Permission escalation patterns', () => {
    it('Guest should have the least permissions', () => {
      const guestPerms = rolePermissions[UserRole.Guest]
      const trueCount = Object.values(guestPerms).filter((v) => v).length

      expect(trueCount).toBe(1) // Only canGetArticles
    })

    it('Reader should have more permissions than Guest', () => {
      const guestPerms = Object.values(rolePermissions[UserRole.Guest]).filter((v) => v).length
      const readerPerms = Object.values(rolePermissions[UserRole.Reader]).filter((v) => v).length

      expect(readerPerms).toBeGreaterThan(guestPerms)
    })

    it('Author should have at least same permissions as Reader plus article creation', () => {
      const readerPerms = rolePermissions[UserRole.Reader]
      const authorPerms = rolePermissions[UserRole.Author]

      // Author should have everything Reader has plus article creation
      expect(authorPerms.canGetArticles).toBe(readerPerms.canGetArticles)
      expect(authorPerms.canCreateComments).toBe(readerPerms.canCreateComments)
      expect(authorPerms.canCreateArticles).toBe(true)
    })

    it('Admin should have most permissions (all except DELETE)', () => {
      const adminPerms = rolePermissions[UserRole.Admin]
      const deletePerms = Object.entries(adminPerms)
        .filter(([key]) => key.startsWith('canDelete'))
        .every(([, value]) => value === false)

      const otherPerms = Object.entries(adminPerms)
        .filter(([key]) => !key.startsWith('canDelete'))
        .every(([, value]) => value === true)

      expect(deletePerms).toBe(true)
      expect(otherPerms).toBe(true)
    })
  })
})
