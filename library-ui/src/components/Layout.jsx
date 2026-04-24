import { useAuth } from '../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const { user, logout, getRoles } = useAuth()
  const roles = getRoles()
  const role = roles[0] || 'USER'

  const badgeClass = role === 'SUPERADMIN' ? 'badge-superadmin' : role === 'ADMIN' ? 'badge-admin' : 'badge-user'

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <BookIcon />
            <span>Library</span>
          </div>
        </div>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {(user?.sub || 'U')[0].toUpperCase()}
            </div>
            <div className={styles.userMeta}>
              <span className={styles.username}>{user?.sub || 'User'}</span>
              <span className={`badge ${badgeClass}`}>{role}</span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={logout} style={{ padding: '8px 14px' }}>
            <LogoutIcon />
            Sign out
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
