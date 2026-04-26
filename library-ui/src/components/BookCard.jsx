import styles from './BookCard.module.css'

const COLORS = ['#c9a96e', '#5c8be0', '#5cb87a', '#e0935c', '#9b5ce0']

export default function BookCard({ book, index, canManage = false, onEdit, onDelete, onToggleAvailability, disabled = false }) {
  const color = COLORS[index % COLORS.length]
  const initials = book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const isAvailable = book.available !== false

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.04}s` }}>
      <div className={styles.spine} style={{ background: `${color}18`, borderColor: `${color}30` }}>
        <span className={styles.initials} style={{ color }}>{initials}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.title}>{book.title}</h3>
          <span className={`badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.isbn}>{book.isbn}</p>
        {canManage && (
          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => onEdit?.(book)} disabled={disabled}>Edit</button>
            <button type="button" className={styles.actionBtn} onClick={() => onToggleAvailability?.(book)} disabled={disabled}>
              Mark {isAvailable ? 'Unavailable' : 'Available'}
            </button>
            <button type="button" className={`${styles.actionBtn} ${styles.dangerBtn}`} onClick={() => onDelete?.(book)} disabled={disabled}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}
