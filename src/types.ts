export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  rating: number;
  isAvailable: boolean;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

export interface BookListResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  count: number;
  data: Book[];
}

export interface BookMasked {
  bookId: string;
  title: string;
  isAvailable: boolean;
  status: string;
}

export type BookDetailResponse = Book | BookMasked;