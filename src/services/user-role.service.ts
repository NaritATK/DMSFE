import apiClient from '@/libs/axios'

export type UserRole = {
  userRoleId: string
  roleId: string
  roleCode: string
  roleName: string
  isActive: boolean
  sysRole?: {
    code?: string
    name?: string
  }
}

export type AdminUser = {
  sysUserId: string
  email: string
  displayName: string | null
  department: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  sysUserRole: UserRole[]
}

export type RoleOption = {
  roleId: string
  code: string
  name: string
}

export const userRoleService = {
  async getUsers() {
    const res = await apiClient.get('/user-roles/users')

    const users = Array.isArray(res.data) ? res.data : []

    return users.map((user: any) => ({
      ...user,
      sysUserRole: Array.isArray(user?.sysUserRole)
        ? user.sysUserRole.map((ur: any) => ({
            ...ur,
            roleCode: ur?.roleCode || ur?.sysRole?.code || '',
            roleName: ur?.roleName || ur?.sysRole?.name || ''
          }))
        : []
    })) as AdminUser[]
  },

  async getRoles() {
    const res = await apiClient.get('/user-roles/roles')
    return res.data as RoleOption[]
  },

  async switchRole(userId: string, newRoleId: string) {
    await apiClient.post('/user-roles/switch', { userId, newRoleId })
  },
}
