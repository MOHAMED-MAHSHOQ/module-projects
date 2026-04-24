import styles from './BookCard.module.css'

const COLORS = ['#c9a96e', '#5c8be0', '#5cb87a', '#e0935c', '#9b5ce0']

export default function BookCard({ book, index }) {
  const color = COLORS[index % COLORS.length]
  const initials = book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.04}s` }}>
      <div className={styles.spine} style={{ background: `${color}18`, borderColor: `${color}30` }}>
        <span className={styles.initials} style={{ color }}>{initials}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.title}>{book.title}</h3>
          <span className={`badge ${book.available ? 'badge-available' : 'badge-unavailable'}`}>
            {book.available ? 'Available' : 'Checked Out'}
          </span>
        </div>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.isbn}>{book.isbn}</p>
      </div>
    </div>
  )
}
