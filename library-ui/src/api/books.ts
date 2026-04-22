import { http } from "./http";
import type { ApiResponse, Book, BookSummary } from "../types";

export async function getAllBooks(): Promise<BookSummary[]> {
  const { data } = await http.get<ApiResponse<BookSummary[]>>("/books");
  return data.data;
}

export async function getAvailableBooks(): Promise<BookSummary[]> {
  const { data } = await http.get<ApiResponse<BookSummary[]>>("/books/available");
  return data.data;
}

export async function searchBooks(query: string): Promise<BookSummary[]> {
  const { data } = await http.get<ApiResponse<BookSummary[]>>("/books/search", {
    params: {
      title: query,
      author: query
    }
  });
  return data.data;
}

export async function checkoutBook(id: number): Promise<Book> {
  const { data } = await http.put<ApiResponse<Book>>(`/books/${id}/checkout`);
  return data.data;
}

export async function returnBook(id: number): Promise<Book> {
  const { data } = await http.put<ApiResponse<Book>>(`/books/${id}/return`);
  return data.data;
}

