import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  checkoutBook,
  getAllBooks,
  getAvailableBooks,
  returnBook,
  searchBooks,
} from "../api/books";
import type { BookSummary } from "../types";

type FilterMode = "all" | "available";

function matchesQuery(book: BookSummary, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
  );
}

export function DashboardPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const booksQuery = useQuery({
    queryKey: ["books", filterMode],
    queryFn: () => (filterMode === "available" ? getAvailableBooks() : getAllBooks()),
  });

  const checkoutMutation = useMutation({
    mutationFn: (id: number) => checkoutBook(id),
    onSuccess: () => {
      toast.success("Book checked out successfully");
      void queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: unknown) => {
      const msg =
          err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id: number) => returnBook(id),
    onSuccess: () => {
      toast.success("Book returned successfully");
      void queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: unknown) => {
      const msg =
          err instanceof Error ? err.message : "Return failed. Please try again.";
      toast.error(msg);
    },
  });

  const searchMutation = useMutation({
    mutationFn: (text: string) => searchBooks(text),
    onError: () => {
      toast.error("Search request failed.");
    },
  });

  // Derive visible books: prefer search results when available
  const visibleBooks = useMemo<BookSummary[]>(() => {
    const source: BookSummary[] = searchMutation.data ?? booksQuery.data ?? [];
    return source.filter((book) => matchesQuery(book, query));
  }, [booksQuery.data, query, searchMutation.data]);

  const allBooks = booksQuery.data ?? [];
  const totalBooks = allBooks.length;
  const availableCount = allBooks.filter((b) => b.available).length;
  const checkedOutCount = Math.max(totalBooks - availableCount, 0);

  const triggerSearch = () => {
    if (!query.trim()) {
      searchMutation.reset();
      return;
    }
    searchMutation.mutate(query.trim());
  };

  const handleReset = () => {
    setQuery("");
    searchMutation.reset();
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
          <div className="search-row">
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or author"
                onKeyDown={(e) => {
                  if (e.key === "Enter") triggerSearch();
                }}
            />
            <button type="button" onClick={triggerSearch}>
              Search
            </button>
            <button type="button" className="button-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>

          <div className="filter-row">
            <button
                type="button"
                className={filterMode === "all" ? "active" : "button-secondary"}
                onClick={() => {
                  setFilterMode("all");
                  searchMutation.reset();
                }}
            >
              All Books
            </button>
            <button
                type="button"
                className={filterMode === "available" ? "active" : "button-secondary"}
                onClick={() => {
                  setFilterMode("available");
                  searchMutation.reset();
                }}
            >
              Available Only
            </button>
          </div>
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
        {searchMutation.isPending && (
            <p className="status-line">Searching…</p>
        )}

        {/* Book grid */}
        <section className="books-grid">
          {visibleBooks.map((book) => (
              <article key={book.id} className="book-card">
                <header>
                  <h3>{book.title}</h3>
                  <span className={book.available ? "chip success" : "chip warning"}>
                {book.available ? "Available" : "Checked Out"}
              </span>
                </header>
                <p className="author">{book.author}</p>
                <footer>
                  {book.available ? (
                      <button
                          type="button"
                          disabled={checkoutMutation.isPending}
                          onClick={() => checkoutMutation.mutate(book.id)}
                      >
                        {checkoutMutation.isPending ? "Processing…" : "Checkout"}
                      </button>
                  ) : (
                      <button
                          type="button"
                          className="button-secondary"
                          disabled={returnMutation.isPending}
                          onClick={() => returnMutation.mutate(book.id)}
                      >
                        {returnMutation.isPending ? "Processing…" : "Return"}
                      </button>
                  )}
                </footer>
              </article>
          ))}

          {!booksQuery.isLoading &&
              !searchMutation.isPending &&
              visibleBooks.length === 0 && (
                  <p className="status-line">No books matched your filters.</p>
              )}
        </section>
      </div>
  );
}