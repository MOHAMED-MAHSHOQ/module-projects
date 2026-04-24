import { useAuth } from '../context/AuthContext'

const LIBRARY_API = 'http://localhost:8081'

export function useApi() {
  const { accessToken, logout } = useAuth()

  const request = async (path, options = {}) => {
    const res = await fetch(`${LIBRARY_API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    })

    if (res.status === 401) { logout(); return }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(err.message || 'Request failed')
    }
    return res.json()
  }

  return {
    getBooks: () => request('/api/books'),
    getBook: (id) => request(`/api/books/${id}`),
    addBook: (book) => request('/api/books', { method: 'POST', body: JSON.stringify(book) }),
  }
}
