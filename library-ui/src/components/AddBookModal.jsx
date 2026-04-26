import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import styles from './AddBookModal.module.css'

const normalizeSpaces = (value) => value.replace(/\s+/g, ' ').trim()

export default function AddBookModal({ onClose, onAdded, initialBook = null }) {
  const api = useApi()
  const [form, setForm] = useState({
    title: initialBook?.title || '',
    author: initialBook?.author || '',
    isbn: initialBook?.isbn || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEditMode = Boolean(initialBook)

  const set = (field) => (e) => {
    const rawValue = e.target.value
    const value = field === 'isbn' ? rawValue.replace(/\D/g, '').slice(0, 13) : rawValue
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const title = normalizeSpaces(form.title)
    const author = normalizeSpaces(form.author)
    const isbn = form.isbn.trim()

    if (!title || !author || (!isEditMode && !isbn)) {
      setError('All fields are required.')
      return
    }
    if (title.length > 25) {
      setError('Title must be at most 25 characters.')
      return
    }
    if (author.length > 25) {
      setError('Author must be at most 25 characters.')
      return
    }
    if (!isEditMode && !/^\d{1,13}$/.test(isbn)) {
      setError('ISBN must be a numeric value with up to 13 digits.')
      return
    }

    const payload = isEditMode ? { title, author } : { title, author, isbn }
    const editId = Number(initialBook?.id)
    if (isEditMode && (!Number.isInteger(editId) || editId <= 0)) {
      setError('Cannot update this book because it has an invalid ID.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = isEditMode
        ? await api.updateBook(editId, payload)
        : await api.addBook(payload)
      onAdded(res?.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <p className="tag" style={{ marginBottom: 4 }}>Catalogue</p>
            <h3 className={styles.title}>{isEditMode ? 'Edit Book' : 'Add New Book'}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Book Title</label>
            <input className="input-field" placeholder="e.g. Clean Code" maxLength={25} value={form.title} onChange={set('title')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Author</label>
            <input className="input-field" placeholder="e.g. Robert C. Martin" maxLength={25} value={form.author} onChange={set('author')} />
          </div>
          {!isEditMode && (
            <div className={styles.field}>
              <label className={styles.label}>ISBN</label>
              <input className="input-field" inputMode="numeric" placeholder="e.g. 9780132350884" maxLength={13} value={form.isbn} onChange={set('isbn')} />
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? (isEditMode ? 'Saving…' : 'Adding…') : (isEditMode ? 'Save Changes' : 'Add Book')}
          </button>
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
}
