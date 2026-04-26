import { useAuth } from '../context/AuthContext'

const LIBRARY_API = 'http://localhost:8081'
const AUTH_API = 'http://localhost:8080'

export function useApi() {
  const { accessToken, logout } = useAuth()

  const parseResponseBody = async (res) => {
    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return res.json()
    }

    const text = await res.text()
    if (!text) return null

    try {
      return JSON.parse(text)
    } catch {
      return { message: text }
    }
  }

  const extractErrorMessage = (err, status) => {
    if (!err) return `Request failed (${status})`
    if (typeof err === 'string') return err
    if (Array.isArray(err)) {
      const first = err.find(Boolean)
      return first ? String(first) : `Request failed (${status})`
    }

    if (typeof err.message === 'string' && err.message.trim()) return err.message
    if (typeof err.error === 'string' && err.error.trim()) return err.error

    if (Array.isArray(err.errors) && err.errors.length > 0) {
      const first = err.errors.find(Boolean)
      return first ? String(first) : `Request failed (${status})`
    }

    if (err.errors && typeof err.errors === 'object') {
      const firstEntry = Object.entries(err.errors).find(([, v]) => Array.isArray(v) ? v.length > 0 : Boolean(v))
      if (firstEntry) {
        const [field, value] = firstEntry
        const text = Array.isArray(value) ? value[0] : value
        return `${field}: ${text}`
      }
    }

    if (typeof err === 'object') {
      const reservedKeys = new Set(['timestamp', 'status', 'error', 'message', 'path'])
      const firstEntry = Object.entries(err).find(([k, v]) => !reservedKeys.has(k) && (Array.isArray(v) ? v.length > 0 : Boolean(v)))
      if (firstEntry) {
        const [field, value] = firstEntry
        const text = Array.isArray(value) ? value[0] : value
        return `${field}: ${text}`
      }
    }

    return `Request failed (${status})`
  }

  const request = async (baseUrl, path, options = {}) => {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    })

    if (res.status === 401) { logout(); return }
    if (res.status === 403) throw new Error('Access denied')
    if (!res.ok) {
      const err = await parseResponseBody(res).catch(() => null)
      throw new Error(extractErrorMessage(err, res.status))
    }

    return parseResponseBody(res)
  }

  const libraryReq = (path, options) => request(LIBRARY_API, path, options)
  const authReq = (path, options) => request(AUTH_API, path, options)

  return {
    // Books (via library-service on 8081)
    getBooks: () => libraryReq('/api/books'),
    getBook: (id) => libraryReq(`/api/books/${id}`),
    addBook: (book) => libraryReq('/api/books', { method: 'POST', body: JSON.stringify(book) }),

    // Users (via auth-server on 8080)
    createUser: (userData) => authReq('/api/users', { method: 'POST', body: JSON.stringify(userData) }),
    updateUserRole: (id, newRole) => authReq(`/api/users/${id}/role?newRole=${encodeURIComponent(newRole)}`, { method: 'PUT' }),
    getUsers: () => authReq('/api/users'),
  }
}