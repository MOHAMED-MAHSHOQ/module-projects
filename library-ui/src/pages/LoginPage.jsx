import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login, accessToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken) navigate('/books')
  }, [accessToken, navigate])

  return (
    <div className={styles.wrapper}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>
          <BookIcon />
        </div>
        <p className="tag" style={{ textAlign: 'center', marginBottom: 8 }}>University System</p>
        <h1 className={styles.title}>Library Portal</h1>
        <p className={styles.sub}>
          Access the university book catalogue, manage collections, and track availability.
        </p>

        <button className={styles.loginBtn} onClick={login}>
          <span>Sign in with SSO</span>
          <ArrowIcon />
        </button>

        <p className={styles.hint}>
          Secured via OAuth 2.0 · PKCE flow
        </p>
      </div>
    </div>
  )
}

function BookIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
