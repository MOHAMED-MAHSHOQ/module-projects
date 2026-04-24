import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AUTH_SERVER = 'http://localhost:8080'
const CLIENT_ID = 'library-client'
const CLIENT_SECRET = 'library-secret'
const REDIRECT_URI = 'http://localhost:5173/callback'
const SCOPES = 'library.read library.write openid'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('access_token'))
  const [user, setUser] = useState(() => {
    const t = sessionStorage.getItem('access_token')
    return t ? parseJwt(t) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(() => {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2)
    sessionStorage.setItem('oauth_state', state)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      state,
    })

    window.location.href = `${AUTH_SERVER}/oauth2/authorize?${params}`
  }, [])

  const handleCallback = useCallback(async (code, returnedState) => {
    setLoading(true)
    setError(null)

    // Validate state to prevent CSRF
    const savedState = sessionStorage.getItem('oauth_state')
    if (savedState && returnedState && savedState !== returnedState) {
      setError('State mismatch — possible CSRF attack.')
      setLoading(false)
      return false
    }
    sessionStorage.removeItem('oauth_state')

    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
      })

      // Use HTTP Basic Auth with client credentials (proper way for confidential clients)
      const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)

      const res = await fetch(`${AUTH_SERVER}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body,
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('Token exchange failed:', errText)
        throw new Error('Token exchange failed: ' + errText)
      }

      const data = await res.json()
      sessionStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) sessionStorage.setItem('refresh_token', data.refresh_token)
      setAccessToken(data.access_token)
      setUser(parseJwt(data.access_token))
      return true
    } catch (e) {
      console.error('Auth error:', e)
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.clear()
    setAccessToken(null)
    setUser(null)
    window.location.href = `${AUTH_SERVER}/logout`
  }, [])

  const getRoles = useCallback(() => {
    if (!user) return []
    return Array.isArray(user.roles) ? user.roles : []
  }, [user])

  const hasRole = useCallback((role) => {
    return getRoles().includes(role)
  }, [getRoles])

  const getHomeRoute = useCallback(() => {
    const roles = getRoles()
    return roles.includes('SUPERADMIN') ? '/users' : '/books'
  }, [getRoles])

  return (
      <AuthContext.Provider value={{ accessToken, user, loading, error, login, handleCallback, logout, getRoles, hasRole, getHomeRoute }}>
        {children}
      </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)