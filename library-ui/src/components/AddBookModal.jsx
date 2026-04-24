import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import styles from './AddBookModal.module.css'

export default function AddBookModal({ onClose, onAdded }) {
  const api = useApi()
  const [form, setForm] = useState({ title: '', author: '', isbn: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.isbn) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await api.addBook({ ...form, available: true })
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
            <h3 className={styles.title}>Add New Book</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Book Title</label>
            <input className="input-field" placeholder="e.g. Clean Code" value={form.title} onChange={set('title')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Author</label>
            <input className="input-field" placeholder="e.g. Robert C. Martin" value={form.author} onChange={set('author')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>ISBN</label>
            <input className="input-field" placeholder="e.g. 978-0132350884" value={form.isbn} onChange={set('isbn')} />
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Adding…' : 'Add Book'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
}
