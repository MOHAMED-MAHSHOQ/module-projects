import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import AddBookModal from '../components/AddBookModal'
import BookCard from '../components/BookCard'
import styles from './BooksPage.module.css'

export default function BooksPage() {
  const api = useApi()
  const { hasRole } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(false)

  // Only ADMIN can add books; SUPERADMIN manages users not books
  const isAdmin = hasRole('ADMIN')

  const loadBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getBooks()
      setBooks(res?.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBooks() }, [])

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
    const isAvailable = b.available !== false
    const matchFilter = filter === 'all' ? true :
        filter === 'available' ? isAvailable : !isAvailable
    return matchSearch && matchFilter
  })

  const handleBookSaved = (book) => {
    if (editingBook) {
      setBooks(prev => prev.map((b) => (String(b.id) === String(book?.id) ? book : b)))
    } else {
      setBooks(prev => [...prev, book])
    }
    setEditingBook(null)
    setShowAdd(false)
  }

  const handleEditBook = (book) => {
    setError(null)
    setEditingBook(book)
  }

  const handleDeleteBook = async (book) => {
    const id = Number(book?.id)
    if (!Number.isInteger(id) || id <= 0) {
      setError('Cannot delete this book because it has an invalid ID.')
      return
    }
    if (!window.confirm(`Delete "${book.title}"? This action cannot be undone.`)) {
      return
    }

    setActionLoading(true)
    setError(null)
    try {
      await api.deleteBook(id)
      setBooks((prev) => prev.filter((b) => String(b.id) !== String(id)))
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleAvailability = async (book) => {
    const id = Number(book?.id)
    if (!Number.isInteger(id) || id <= 0) {
      setError('Cannot update availability because this book has an invalid ID.')
      return
    }

    const nextAvailable = !(book?.available !== false)

    setActionLoading(true)
    setError(null)
    try {
      const res = await api.patchBook(id, { available: nextAvailable })
      const updatedBook = res?.data

      if (updatedBook) {
        setBooks((prev) => prev.map((b) => (String(b.id) === String(id) ? updatedBook : b)))
      } else {
        setBooks((prev) => prev.map((b) => (String(b.id) === String(id) ? { ...b, available: nextAvailable } : b)))
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const available = books.filter(b => b.available !== false).length

  return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p className="tag" style={{ marginBottom: 4 }}>Collection</p>
            <h2 className={styles.title}>Book Catalogue</h2>
          </div>
          {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                <PlusIcon /> Add Book
              </button>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{books.length}</span>
            <span className={styles.statLabel}>Total Books</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: 'var(--green)' }}>{available}</span>
            <span className={styles.statLabel}>Available</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: 'var(--text-muted)' }}>{books.length - available}</span>
            <span className={styles.statLabel}>Unavailable</span>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <SearchIcon />
            <input
                className={`input-field ${styles.search}`}
                placeholder="Search by title or author…"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            {['all', 'available', 'unavailable'].map(f => (
                <button
                    key={f}
                    className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                    onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
          </div>
        </div>

        {loading ? (
            <div className={styles.center}>
              <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            </div>
        ) : error ? (
            <div className={styles.center}>
              <p style={{ color: 'var(--red)', fontSize: 14 }}>{error}</p>
              <button className="btn btn-ghost" onClick={loadBooks} style={{ marginTop: 12 }}>Retry</button>
            </div>
        ) : filtered.length === 0 ? (
            <div className={styles.center}>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No books found.</p>
            </div>
        ) : (
            <div className={styles.grid}>
              {filtered.map((book, i) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    index={i}
                    canManage={isAdmin}
                    disabled={actionLoading}
                    onEdit={handleEditBook}
                    onToggleAvailability={handleToggleAvailability}
                    onDelete={handleDeleteBook}
                  />
              ))}
            </div>
        )}

        {(showAdd || editingBook) && (
            <AddBookModal
              initialBook={editingBook}
              onClose={() => {
                setShowAdd(false)
                setEditingBook(null)
              }}
              onAdded={handleBookSaved}
            />
        )}
      </div>
  )
}

function PlusIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}