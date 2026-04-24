import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CallbackPage() {
  const { handleCallback, error, getHomeRoute } = useAuth()
  const navigate = useNavigate()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const err = params.get('error')

    if (err || !code) {
      console.error('OAuth error or missing code:', err)
      navigate('/', { replace: true })
      return
    }

    handleCallback(code, state).then((success) => {
      if (success) {
        navigate(getHomeRoute(), { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    })
  }, [])

  return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--bg)',
      }}>
        {error ? (
            <>
              <p style={{ color: 'var(--red)', fontSize: 14, maxWidth: 400, textAlign: 'center' }}>
                Authentication failed: {error}
              </p>
              <button
                  className="btn btn-ghost"
                  onClick={() => navigate('/', { replace: true })}
                  style={{ marginTop: 8 }}
              >
                Back to Login
              </button>
            </>
        ) : (
            <>
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Signing you in…</p>
            </>
        )}
      </div>
  )
}