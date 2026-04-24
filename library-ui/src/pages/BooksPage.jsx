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
  const [filter, setFilter] = useState('all') // all | available | unavailable

  const isAdmin = hasRole('ADMIN') || hasRole('SUPERADMIN')

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
    const matchFilter = filter === 'all' ? true :
                        filter === 'available' ? b.available : !b.available
    return matchSearch && matchFilter
  })

  const handleBookAdded = (newBook) => {
    setBooks(prev => [...prev, newBook])
    setShowAdd(false)
  }

  const available = books.filter(b => b.available).length

  return (
    <div className={styles.page}>
      {/* Header */}
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

      {/* Stats */}
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
          <span className={styles.statLabel}>Checked Out</span>
        </div>
      </div>

      {/* Controls */}
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

      {/* Content */}
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
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddBookModal onClose={() => setShowAdd(false)} onAdded={handleBookAdded} />
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
