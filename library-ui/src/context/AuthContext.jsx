import { createContext, useContext, useState, useCallback } from 'react'

const AUTH_SERVER = 'http://localhost:8080'
const CLIENT_ID = 'library-client'
const REDIRECT_URI = 'http://localhost:5173/callback'
const SCOPES = 'library.read library.write openid'

const AuthContext = createContext(null)

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(digest)
}

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

  const login = useCallback(async () => {
    const verifier = await generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    sessionStorage.setItem('pkce_verifier', verifier)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    })

    window.location.href = `${AUTH_SERVER}/oauth2/authorize?${params}`
  }, [])

  const handleCallback = useCallback(async (code) => {
    setLoading(true)
    setError(null)
    const verifier = sessionStorage.getItem('pkce_verifier')

    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: 'library-secret', // needed because server registered with secret
      })
      // Only add code_verifier if we have one (PKCE)
      if (verifier) {
        body.append('code_verifier', verifier)
      }

      const res = await fetch(`${AUTH_SERVER}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
      sessionStorage.removeItem('pkce_verifier')
      setAccessToken(data.access_token)
      setUser(parseJwt(data.access_token))
    } catch (e) {
      console.error('Auth error:', e)
      setError(e.message)
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

  return (
      <AuthContext.Provider value={{ accessToken, user, loading, error, login, handleCallback, logout, getRoles, hasRole }}>
        {children}
      </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)