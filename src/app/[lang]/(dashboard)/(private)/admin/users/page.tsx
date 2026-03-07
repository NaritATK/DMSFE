'use client'

import { useEffect, useMemo, useState } from 'react'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'

import RoleGuard from '@/components/auth/RoleGuard'
import { useDictionary } from '@/hooks/useDictionary'
import { userAccessService, type UserAccess } from '@/services/user-access.service'
import { userRoleService, type AdminUser, type RoleOption } from '@/services/user-role.service'
import SwitchRoleDialog from '@/views/admin/users/SwitchRoleDialog'
import UserTable from '@/views/admin/users/UserTable'

type SnackbarState = {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

type TabValue = 'users' | 'access'

const initialSnackbar: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
}

const normalizeAccessEmail = (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return ''
  if (normalized.includes('@')) return normalized
  return `${normalized}@up.ac.th`
}

// ============ Header Section Component ============
const PageHeader = ({ 
  t, 
  onRefresh 
}: { 
  t: any
  onRefresh: () => void 
}) => (
  <Box sx={{ mb: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
        <Icon icon='tabler-users' fontSize={24} />
      </Avatar>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          {t('dms.admin.users.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('dms.admin.users.subheader')}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button 
        variant="outlined" 
        size="small"
        startIcon={<Icon icon='tabler-refresh' />} 
        onClick={onRefresh}
      >
        {t('dms.common.refresh')}
      </Button>
    </Box>
  </Box>
)

// ============ Users Tab Component ============
const UsersTab = ({
  t,
  users,
  roles,
  loading,
  searchQuery,
  setSearchQuery,
  onSwitchRole,
}: {
  t: any
  users: AdminUser[]
  roles: RoleOption[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (val: string) => void
  onSwitchRole: (user: AdminUser) => void
}) => {
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users

    return users.filter(user =>
      user.email.toLowerCase().includes(query) ||
      user.displayName?.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query) ||
      user.sysUserRole?.some(ur => (ur.roleCode || ur.sysRole?.code || '').toLowerCase().includes(query))
    )
  }, [users, searchQuery])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Search & Stats */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t('dms.admin.users.searchPlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="tabler-search" fontSize={20} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { xs: '100%', sm: 400 } }}
        />
        <Chip 
          label={`${filteredUsers.length} ${t('dms.admin.users.usersFound')}`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UserTable
              users={filteredUsers}
              onSwitchRole={onSwitchRole}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

// ============ Access Control Tab Component ============
const AccessControlTab = ({
  t,
  accessList,
  accessLoading,
  accessEmail,
  setAccessEmail,
  accessRole,
  setAccessRole,
  onAddAccess,
  onToggleAccess,
}: {
  t: any
  accessList: UserAccess[]
  accessLoading: boolean
  accessEmail: string
  setAccessEmail: (val: string) => void
  accessRole: 'ADMIN' | 'STAFF'
  setAccessRole: (val: 'ADMIN' | 'STAFF') => void
  onAddAccess: () => void
  onToggleAccess: (accessId: string) => void
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {/* Add Access Form */}
    <Card variant="outlined">
      <CardHeader 
        title={t('dms.admin.users.grantAccess')}
        subheader={t('dms.admin.users.grantAccessSubheader')}
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <TextField
            label={t('dms.common.email')}
            value={accessEmail}
            onChange={e => setAccessEmail(e.target.value)}
            onBlur={() => accessEmail.trim() && setAccessEmail(normalizeAccessEmail(accessEmail))}
            placeholder={t('dms.admin.users.accessEmailPlaceholder')}
            sx={{ minWidth: 280, flex: 1 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="tabler-mail" fontSize={18} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            size="small"
            label={t('dms.admin.users.role')}
            value={accessRole}
            onChange={e => setAccessRole(e.target.value as 'ADMIN' | 'STAFF')}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="STAFF">STAFF</MenuItem>
          </TextField>
          <Button 
            variant="contained" 
            onClick={onAddAccess}
            startIcon={<Icon icon="tabler-plus" />}
          >
            {t('dms.admin.users.addAccess')}
          </Button>
        </Box>
      </CardContent>
    </Card>

    {/* Access List */}
    <Card>
      <CardHeader 
        title={t('dms.admin.users.accessList')}
        subheader={`${accessList.length} ${t('dms.admin.users.entries')}`}
      />
      <CardContent>
        {accessLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2">{t('dms.admin.users.loadingAccess')}</Typography>
          </Box>
        ) : accessList.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Icon icon="tabler-shield-off" fontSize={48} style={{ opacity: 0.3 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {t('dms.admin.users.noAccessEntries')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {accessList.map(entry => (
              <Box 
                key={entry.accessId} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: entry.isActive ? 'background.paper' : 'action.disabledBackground',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: entry.roleCode === 'ADMIN' ? 'error.main' : 'info.main'
                    }}
                  >
                    <Icon icon={entry.roleCode === 'ADMIN' ? 'tabler-crown' : 'tabler-user'} fontSize={18} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {entry.email}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label={entry.roleCode} 
                        size="small"
                        color={entry.roleCode === 'ADMIN' ? 'error' : 'info'}
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        •
                      </Typography>
                      <Chip 
                        label={entry.isActive ? t('dms.admin.common.active') : t('dms.admin.common.inactive')}
                        size="small"
                        color={entry.isActive ? 'success' : 'default'}
                      />
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant={entry.isActive ? 'outlined' : 'contained'}
                  color={entry.isActive ? 'error' : 'success'}
                  size="small"
                  startIcon={<Icon icon={entry.isActive ? 'tabler-ban' : 'tabler-check'} />}
                  onClick={() => onToggleAccess(entry.accessId)}
                >
                  {entry.isActive ? t('dms.admin.users.deactivate') : t('dms.admin.users.activate')}
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
)

// ============ Main Page Component ============
export default function UsersPage() {
  const { t } = useDictionary()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [switchDialogOpen, setSwitchDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const [snackbar, setSnackbar] = useState<SnackbarState>(initialSnackbar)

  const [accessList, setAccessList] = useState<UserAccess[]>([])
  const [accessLoading, setAccessLoading] = useState(false)
  const [accessEmail, setAccessEmail] = useState('')
  const [accessRole, setAccessRole] = useState<'ADMIN' | 'STAFF'>('STAFF')

  const [activeTab, setActiveTab] = useState<TabValue>('users')

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      setUsers(await userRoleService.getUsers())
    } catch (error) {
      console.error('Error fetching users:', error)
      showSnackbar(t('dms.admin.users.errors.fetchUsers'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      setRoles(await userRoleService.getRoles())
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const fetchAccessList = async () => {
    setAccessLoading(true)
    try {
      setAccessList(await userAccessService.getAll())
    } catch (error) {
      console.error('Error fetching access list:', error)
      showSnackbar(t('dms.admin.users.errors.fetchAccess'), 'error')
    } finally {
      setAccessLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchUsers()
    fetchRoles()
    fetchAccessList()
  }

  useEffect(() => {
    handleRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddAccess = async () => {
    if (!accessEmail.trim()) return

    try {
      await userAccessService.create(normalizeAccessEmail(accessEmail), accessRole)
      setAccessEmail('')
      showSnackbar(t('dms.admin.users.accessAdded'), 'success')
      await fetchAccessList()
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || t('dms.admin.users.errors.addAccess'), 'error')
    }
  }

  const handleToggleAccess = async (accessId: string) => {
    try {
      await userAccessService.toggle(accessId)
      showSnackbar(t('dms.admin.users.accessUpdated'), 'success')
      await fetchAccessList()
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || t('dms.admin.users.errors.updateAccess'), 'error')
    }
  }

  const handleSwitchRoleConfirm = async (userId: string, newRoleId: string) => {
    try {
      await userRoleService.switchRole(userId, newRoleId)
      showSnackbar(t('dms.admin.users.roleSwitched'), 'success')
      setSwitchDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || error.message || t('dms.admin.users.errors.switchRole'), 'error')
    }
  }

  return (
    <RoleGuard requiredRole='ADMIN'>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Page Header */}
        <PageHeader t={t} onRefresh={handleRefresh} />

        {/* Tabs Navigation */}
        <Card sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, val) => setActiveTab(val)}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTabs-flexContainer': { px: 2, pt: 1 }
            }}
          >
            <Tab 
              value="users" 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="tabler-users" />
                  {t('dms.admin.users.usersTab')}
                </Box>
              }
            />
            <Tab 
              value="access" 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon icon="tabler-shield" />
                  {t('dms.admin.users.accessControlTab')}
                </Box>
              }
            />
          </Tabs>

          <Divider />

          <CardContent sx={{ p: 3 }}>
            {activeTab === 'users' && (
              <UsersTab
                t={t}
                users={users}
                roles={roles}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSwitchRole={user => {
                  setSelectedUser(user)
                  setSwitchDialogOpen(true)
                }}
              />
            )}

            {activeTab === 'access' && (
              <AccessControlTab
                t={t}
                accessList={accessList}
                accessLoading={accessLoading}
                accessEmail={accessEmail}
                setAccessEmail={setAccessEmail}
                accessRole={accessRole}
                setAccessRole={setAccessRole}
                onAddAccess={handleAddAccess}
                onToggleAccess={handleToggleAccess}
              />
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        {selectedUser && (
          <SwitchRoleDialog
            open={switchDialogOpen}
            user={selectedUser}
            roles={roles}
            onClose={() => {
              setSwitchDialogOpen(false)
              setSelectedUser(null)
            }}
            onSwitch={handleSwitchRoleConfirm}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </RoleGuard>
  )
}
