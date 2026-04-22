import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkoutBook, getAllBooks, getAvailableBooks, returnBook, searchBooks } from "../api/books";
import type { BookSummary } from "../types";

type FilterMode = "all" | "available";

function matchesQuery(book: BookSummary, query: string): boolean {
  if (!query.trim()) {
    return true;
  }
  const normalizedQuery = query.toLowerCase();
  return (
    book.title.toLowerCase().includes(normalizedQuery) ||
    book.author.toLowerCase().includes(normalizedQuery)
  );
}

export function DashboardPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const booksQuery = useQuery({
    queryKey: ["books", filterMode],
    queryFn: () => (filterMode === "available" ? getAvailableBooks() : getAllBooks())
  });

  const checkoutMutation = useMutation({
    mutationFn: (id: number) => checkoutBook(id),
    onSuccess: () => {
      toast.success("Book checked out successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => {
      toast.error("Checkout failed. Please try again.");
    }
  });

  const returnMutation = useMutation({
    mutationFn: (id: number) => returnBook(id),
    onSuccess: () => {
      toast.success("Book returned successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => {
      toast.error("Return failed. Please try again.");
    }
  });

  const searchMutation = useMutation({
    mutationFn: (text: string) => searchBooks(text),
    onError: () => {
      toast.error("Search request failed.");
    }
  });

  const visibleBooks = useMemo(() => {
    const source = searchMutation.data ?? booksQuery.data ?? [];
    return source.filter((book) => matchesQuery(book, query));
  }, [booksQuery.data, query, searchMutation.data]);

  const totalBooks = booksQuery.data?.length ?? 0;
  const availableBooks = (booksQuery.data ?? []).filter((book) => book.available).length;

  const triggerSearch = () => {
    if (!query.trim()) {
      searchMutation.reset();
      return;
    }
    searchMutation.mutate(query.trim());
  };

  return (
    <div className="dashboard-shell">
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Catalog</span>
          <strong>{totalBooks}</strong>
        </div>
        <div className="stat-card">
          <span>Available Now</span>
          <strong>{availableBooks}</strong>
        </div>
        <div className="stat-card">
          <span>Checked Out</span>
          <strong>{Math.max(totalBooks - availableBooks, 0)}</strong>
        </div>
      </section>

      <section className="toolbar-card">
        <div className="search-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or author"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                triggerSearch();
              }
            }}
          />
          <button type="button" onClick={triggerSearch}>
            Search
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              setQuery("");
              searchMutation.reset();
            }}
          >
            Reset
          </button>
        </div>

        <div className="filter-row">
          <button
            type="button"
            className={filterMode === "all" ? "active" : "button-secondary"}
            onClick={() => setFilterMode("all")}
          >
            All Books
          </button>
          <button
            type="button"
            className={filterMode === "available" ? "active" : "button-secondary"}
            onClick={() => setFilterMode("available")}
          >
            Available Only
          </button>
        </div>
      </section>

      {booksQuery.isLoading ? <p className="status-line">Loading catalog...</p> : null}
      {booksQuery.isError ? <p className="status-line error">Could not load catalog from service.</p> : null}

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
                  Checkout
                </button>
              ) : (
                <button
                  type="button"
                  className="button-secondary"
                  disabled={returnMutation.isPending}
                  onClick={() => returnMutation.mutate(book.id)}
                >
                  Return
                </button>
              )}
            </footer>
          </article>
        ))}
        {!booksQuery.isLoading && visibleBooks.length === 0 ? (
          <p className="status-line">No books matched your filters.</p>
        ) : null}
      </section>
    </div>
  );
}

