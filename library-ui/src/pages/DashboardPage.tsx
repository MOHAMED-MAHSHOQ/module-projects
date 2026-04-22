import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addBook, getAllBooks, getBookById } from "../api/books";
import type { Book } from "../types";

export function DashboardPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [bookId, setBookId] = useState("");

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
  });

  const addBookMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      toast.success("Book added successfully");
      setTitle("");
      setAuthor("");
      setIsbn("");
      void queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: unknown) => {
      const msg =
          err instanceof Error ? err.message : "Adding book failed. Please try again.";
      toast.error(msg);
    },
  });

  const findByIdMutation = useMutation({
    mutationFn: (id: number) => getBookById(id),
    onSuccess: () => {
      toast.success("Book fetched");
    },
    onError: (err: unknown) => {
      const msg =
          err instanceof Error ? err.message : "Could not fetch book by ID.";
      toast.error(msg);
    },
  });

  const allBooks = booksQuery.data ?? [];
  const totalBooks = allBooks.length;
  const availableCount = allBooks.filter((b) => b.available).length;
  const checkedOutCount = Math.max(totalBooks - availableCount, 0);

  const handleFindBook = () => {
    const parsedId = Number(bookId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      toast.error("Enter a valid numeric book ID.");
      return;
    }
    findByIdMutation.mutate(parsedId);
  };

  const selectedBook: Book | null = findByIdMutation.data ?? null;

  const handleAddBook = () => {
    if (!title.trim() || !author.trim() || !isbn.trim()) {
      toast.error("Title, author and ISBN are required.");
      return;
    }
    addBookMutation.mutate({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      available: true,
    });
  };

  return (
      <div className="dashboard-shell">
        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Catalog</span>
            <strong>{totalBooks}</strong>
          </div>
          <div className="stat-card">
            <span>Available Now</span>
            <strong>{availableCount}</strong>
          </div>
          <div className="stat-card">
            <span>Checked Out</span>
            <strong>{checkedOutCount}</strong>
          </div>
        </section>

        {/* Toolbar */}
        <section className="toolbar-card">
          <h3>Add Book</h3>
          <div className="search-row">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
            />
            <input
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="ISBN"
            />
            <button type="button" onClick={handleAddBook} disabled={addBookMutation.isPending}>
              {addBookMutation.isPending ? "Saving..." : "Add"}
            </button>
          </div>

          <h3 style={{ marginTop: "1rem" }}>Find by ID</h3>
          <div className="search-row">
            <input
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="Book ID"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFindBook();
                }}
            />
            <button
                type="button"
                onClick={handleFindBook}
                disabled={findByIdMutation.isPending}
            >
              {findByIdMutation.isPending ? "Searching..." : "Get Book"}
            </button>
          </div>

          {selectedBook && (
              <p className="status-line">
                Selected: {selectedBook.title} by {selectedBook.author} ({selectedBook.available ? "Available" : "Checked Out"})
              </p>
          )}
        </section>

        {/* Status */}
        {booksQuery.isLoading && (
            <p className="status-line">Loading catalog…</p>
        )}
        {booksQuery.isError && (
            <p className="status-line error">
              Could not load catalog. Is the library service running?
            </p>
        )}
        {/* Book grid */}
        <section className="books-grid">
          {allBooks.map((book) => (
              <article key={book.id} className="book-card">
                <header>
                  <h3>{book.title}</h3>
                  <span className={book.available ? "chip success" : "chip warning"}>
                {book.available ? "Available" : "Checked Out"}
              </span>
                </header>
                <p className="author">{book.author}</p>
                <footer>
                  <small>ID: {book.id}</small>
                </footer>
              </article>
          ))}

          {!booksQuery.isLoading && allBooks.length === 0 && (
              <p className="status-line">No books found.</p>
          )}
        </section>
      </div>
  );
}