import { http } from "./http";
import type { ApiResponse, Book, BookSummary } from "../types";

export type CreateBookPayload = {
  title: string;
  author: string;
  isbn: string;
  available?: boolean;
};

export async function getAllBooks(): Promise<BookSummary[]> {
  const { data } = await http.get<ApiResponse<BookSummary[]>>("/books");
  return data.data;
}

export async function getBookById(id: number): Promise<Book> {
  const { data } = await http.get<ApiResponse<Book>>(`/books/${id}`);
  return data.data;
}

export async function addBook(payload: CreateBookPayload): Promise<Book> {
  const { data } = await http.post<ApiResponse<Book>>("/books", payload);
  return data.data;
}

