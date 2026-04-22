export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type BookSummary = {
  id: number;
  title: string;
  author: string;
  available: boolean;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
};

