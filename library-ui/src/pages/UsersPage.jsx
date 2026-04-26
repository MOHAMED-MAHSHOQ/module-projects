import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import styles from './UsersPage.module.css'

const ROLES = ['USER', 'ADMIN', 'SUPERADMIN']

const normalizeSpaces = (value) => value.replace(/\s+/g, ' ').trim()
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function UsersPage() {
    const api = useApi()

    // Create user form
    const [createForm, setCreateForm] = useState({ username: '', password: '', email: '', role: 'USER' })
    const [createLoading, setCreateLoading] = useState(false)
    const [createError, setCreateError] = useState(null)
    const [createSuccess, setCreateSuccess] = useState(null)

    // Update role form
    const [updateForm, setUpdateForm] = useState({ userId: '', newRole: 'USER' })
    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateError, setUpdateError] = useState(null)
    const [updateSuccess, setUpdateSuccess] = useState(null)
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(true)
    const [usersError, setUsersError] = useState(null)

    const setCreate = (field) => (e) =>
        setCreateForm(prev => ({ ...prev, [field]: e.target.value }))

    const setUpdate = (field) => (e) =>
        setUpdateForm(prev => ({ ...prev, [field]: e.target.value }))

    const loadUsers = async () => {
        setUsersLoading(true)
        setUsersError(null)
        try {
            const result = await api.getUsers()
            const rawUsers = Array.isArray(result)
                ? result
                : (Array.isArray(result?.data) ? result.data : [])

            const normalizedUsers = rawUsers
                .map((u) => {
                    const idValue = Number(u?.id ?? u?.userId)
                    return {
                        ...u,
                        id: Number.isInteger(idValue) && idValue > 0 ? idValue : null,
                    }
                })
                .filter((u) => u.id !== null)

            setUsers(normalizedUsers)
            if (rawUsers.length > 0 && normalizedUsers.length === 0) {
                setUsersError('Users loaded, but IDs are missing from API response. Please restart auth-server with latest changes.')
            }
        } catch (e) {
            setUsersError(e.message || 'Failed to load users.')
        } finally {
            setUsersLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleCreateUser = async () => {
        const username = normalizeSpaces(createForm.username)
        const email = createForm.email.trim()
        const password = createForm.password.trim()
        const role = createForm.role

        if (!username || !password || !email || !role) {
            setCreateError('All fields are required.')
            return
        }
        if (username.length < 3 || username.length > 20) {
            setCreateError('Username must be between 3 and 20 characters.')
            return
        }
        if (!isValidEmail(email)) {
            setCreateError('Please provide a valid email address.')
            return
        }
        if (password.length < 8) {
            setCreateError('Password must be at least 8 characters long.')
            return
        }
        if (!ROLES.includes(role)) {
            setCreateError('Please select a valid role.')
            return
        }

        const payload = { username, password, email, role }

        setCreateLoading(true)
        setCreateError(null)
        setCreateSuccess(null)
        try {
            await api.createUser(payload)
            setCreateSuccess(`User "${username}" created successfully with role ${role}.`)
            setCreateForm({ username: '', password: '', email: '', role: 'USER' })
            await loadUsers()
        } catch (e) {
            setCreateError(e.message)
        } finally {
            setCreateLoading(false)
        }
    }

    const handleUpdateRole = async () => {
        const { userId, newRole } = updateForm
        if (!userId) {
            setUpdateError('Please select a user first.')
            return
        }
        const selectedUser = users.find(u => String(u.id) === String(userId))
        if (!selectedUser) {
            setUpdateError('Selected user is invalid. Please reselect a user from the list.')
            return
        }
        const id = Number(selectedUser.id)
        if (!Number.isInteger(id) || id <= 0) {
            setUpdateError('Selected user has an invalid ID. Refresh users and try again.')
            return
        }
        if (!ROLES.includes(newRole)) {
            setUpdateError('Please select a valid role.')
            return
        }
        if (selectedUser.role === newRole) {
            setUpdateError(`User already has the role: ${newRole}`)
            return
        }
        setUpdateLoading(true)
        setUpdateError(null)
        setUpdateSuccess(null)
        try {
            await api.updateUserRole(id, newRole)
            const selectedLabel = selectedUser.username ? `${selectedUser.username} (#${id})` : `#${id}`
            setUpdateSuccess(`User ${selectedLabel} role updated to ${newRole} successfully.`)
            setUpdateForm({ userId: '', newRole: 'USER' })
            await loadUsers()
        } catch (e) {
            const msg = e?.message || 'Failed to update role.'
            setUpdateError(msg.includes('positive number') ? 'Selected user ID is invalid in backend response. Please refresh users and retry.' : msg)
        } finally {
            setUpdateLoading(false)
        }
    }

    const selectedUser = users.find(u => String(u.id) === String(updateForm.userId))

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <p className="tag" style={{ marginBottom: 4 }}>Administration</p>
                    <h2 className={styles.title}>User Management</h2>
                </div>
                <div className={styles.headerBadge}>
                    <SuperAdminIcon />
                    <span>SUPERADMIN only</span>
                </div>
            </div>

            <div className={styles.info}>
                <InfoIcon />
                <p>Manage system users and their roles. The SUPERADMIN role can only be assigned to one user at a time. Select a user from the list to update roles.</p>
            </div>

            <div className={styles.grid}>
                {/* ── Create User ── */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon} style={{ background: 'rgba(92,184,122,0.12)', borderColor: 'rgba(92,184,122,0.25)' }}>
                            <UserPlusIcon color="var(--green)" />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle}>Create New User</h3>
                            <p className={styles.cardSub}>Add a user account to the system</p>
                        </div>
                    </div>

                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label className={styles.label}>Username</label>
                            <input
                                className="input-field"
                                placeholder="e.g. john_doe"
                                value={createForm.username}
                                onChange={setCreate('username')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                className="input-field"
                                type="email"
                                placeholder="e.g. john@university.edu"
                                value={createForm.email}
                                onChange={setCreate('email')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Password</label>
                            <input
                                className="input-field"
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={createForm.password}
                                onChange={setCreate('password')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Role</label>
                            <div className={styles.roleSelector}>
                                {ROLES.map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`${styles.roleBtn} ${createForm.role === r ? styles.roleBtnActive : ''}`}
                                        style={createForm.role === r ? getRoleStyle(r) : {}}
                                        onClick={() => setCreateForm(prev => ({ ...prev, role: r }))}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {createError && <StatusMessage type="error" message={createError} />}
                        {createSuccess && <StatusMessage type="success" message={createSuccess} />}
                    </div>

                    <div className={styles.cardFooter}>
                        <button
                            className="btn btn-primary"
                            onClick={handleCreateUser}
                            disabled={createLoading}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {createLoading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <UserPlusIcon color="#0d0f14" />}
                            {createLoading ? 'Creating…' : 'Create User'}
                        </button>
                    </div>
                </div>

                {/* ── Update Role ── */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon} style={{ background: 'rgba(92,139,224,0.12)', borderColor: 'rgba(92,139,224,0.25)' }}>
                            <EditRoleIcon color="var(--blue)" />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle}>Update User Role</h3>
                            <p className={styles.cardSub}>Change an existing user's permissions</p>
                        </div>
                    </div>

                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label className={styles.label}>User</label>
                            <select
                                className="input-field"
                                value={updateForm.userId}
                                onChange={setUpdate('userId')}
                                disabled={usersLoading}
                            >
                                <option value="">{usersLoading ? 'Loading users...' : 'Select user to update'}</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.username} ({u.email}) - {u.role}</option>
                                ))}
                            </select>
                            <p className={styles.hint}>Pick a user from the list. No need to remember database IDs.</p>
                            {usersError && <StatusMessage type="error" message={usersError} />}
                            {!usersLoading && users.length === 0 && <StatusMessage type="error" message="No users found." />}
                            {selectedUser && (
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                    Selected: <strong style={{ color: 'var(--text-primary)' }}>{selectedUser.username}</strong> ({selectedUser.email}) - current role <strong style={{ color: 'var(--text-primary)' }}>{selectedUser.role}</strong>
                                </div>
                            )}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>New Role</label>
                            <div className={styles.roleSelector}>
                                {ROLES.map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`${styles.roleBtn} ${updateForm.newRole === r ? styles.roleBtnActive : ''}`}
                                        style={updateForm.newRole === r ? getRoleStyle(r) : {}}
                                        onClick={() => setUpdateForm(prev => ({ ...prev, newRole: r }))}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.roleInfo}>
                            <RoleDescription role={updateForm.newRole} />
                        </div>

                        {updateError && <StatusMessage type="error" message={updateError} />}
                        {updateSuccess && <StatusMessage type="success" message={updateSuccess} />}
                    </div>

                    <div className={styles.cardFooter}>
                        <button
                            className="btn"
                            onClick={handleUpdateRole}
                            disabled={updateLoading || usersLoading || users.length === 0}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                background: 'rgba(92,139,224,0.15)',
                                color: 'var(--blue)',
                                border: '1px solid rgba(92,139,224,0.3)',
                            }}
                        >
                            {updateLoading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <EditRoleIcon color="var(--blue)" />}
                            {updateLoading ? 'Updating…' : 'Update Role'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Role Reference */}
            <div className={styles.roleReference}>
                <p className="tag" style={{ marginBottom: 12 }}>Role Reference</p>
                <div className={styles.roleCards}>
                    {[
                        { role: 'USER', desc: 'Can browse and view the book catalogue. Read-only access.', icon: '👤' },
                        { role: 'ADMIN', desc: 'All USER permissions plus ability to add new books to the catalogue.', icon: '🛡️' },
                        { role: 'SUPERADMIN', desc: 'Full system access. Manages users and roles. Only one allowed.', icon: '⭐' },
                    ].map(({ role, desc, icon }) => (
                        <div key={role} className={styles.roleCard}>
                            <div className={styles.roleCardTop}>
                                <span className={styles.roleEmoji}>{icon}</span>
                                <span className={`badge ${role === 'SUPERADMIN' ? 'badge-superadmin' : role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                  {role}
                </span>
                            </div>
                            <p className={styles.roleDesc}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function getRoleStyle(role) {
    if (role === 'SUPERADMIN') return { background: 'rgba(224,92,92,0.15)', color: 'var(--red)', borderColor: 'rgba(224,92,92,0.4)' }
    if (role === 'ADMIN') return { background: 'rgba(92,139,224,0.15)', color: 'var(--blue)', borderColor: 'rgba(92,139,224,0.4)' }
    return { background: 'rgba(201,169,110,0.15)', color: 'var(--accent)', borderColor: 'rgba(201,169,110,0.4)' }
}

function RoleDescription({ role }) {
    const descriptions = {
        USER: 'Can view and search books. No write access.',
        ADMIN: 'Can view books and add new books to the catalogue.',
        SUPERADMIN: 'Full access. Manages all users and roles. System-wide admin.',
    }
    return (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{role}: </strong>{descriptions[role]}
        </div>
    )
}

function StatusMessage({ type, message }) {
    const isError = type === 'error'
    return (
        <div style={{
            fontSize: 13,
            color: isError ? 'var(--red)' : 'var(--green)',
            background: isError ? 'var(--red-dim)' : 'var(--green-dim)',
            border: `1px solid ${isError ? 'rgba(224,92,92,0.2)' : 'rgba(92,184,122,0.2)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
        }}>
            {message}
        </div>
    )
}

function UserPlusIcon({ color = 'currentColor' }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="16" y1="11" x2="22" y2="11"/>
        </svg>
    )
}

function EditRoleIcon({ color = 'currentColor' }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    )
}

function SuperAdminIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
    )
}

function InfoIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
    )
}