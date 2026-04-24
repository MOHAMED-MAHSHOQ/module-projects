import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CallbackPage() {
  const { handleCallback, error } = useAuth()
  const navigate = useNavigate()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const err = params.get('error')

    if (err || !code) {
      navigate('/')
      return
    }

    handleCallback(code).then(() => {
      navigate('/books')
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16
    }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        {error ? `Error: ${error}` : 'Signing you in…'}
      </p>
    </div>
  )
}
