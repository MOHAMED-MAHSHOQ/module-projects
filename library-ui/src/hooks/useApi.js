import { useAuth } from '../context/AuthContext'

const LIBRARY_API = 'http://localhost:8081'
const AUTH_API = 'http://localhost:8080'

export function useApi() {
  const { accessToken, logout } = useAuth()

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
      const err = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(err.message || 'Request failed')
    }
    return res.json()
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
    updateUserRole: (id, newRole) => authReq(`/api/users/${id}/role?newRole=${newRole}`, { method: 'PUT' }),
  }
}