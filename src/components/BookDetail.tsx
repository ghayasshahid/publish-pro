import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";
import type { BookDetailResponse, Book } from "../types";


function isFullBook(book: BookDetailResponse): book is Book {
  return "price" in book;
}

function BookDetail() {
  const { id } = useParams(); 

  const { data, isLoading, error } = useQuery<BookDetailResponse>({
    queryKey: ["book", id],
    queryFn: () => apiFetch(`/api/books/${id}`),
  });

  if (isLoading) return <p>Loading book...</p>;
  if (error) {
    return (
      <p style={{ color: "red" }}>
        {error instanceof Error ? error.message : "Failed to load book"}
      </p>
    );
  }
  if (!data) return null;

  if (isFullBook(data)) {
    return (
      <div className="book-detail">
        <h1>{data.title}</h1>
        <p>by {data.author}</p>
        <p>${data.price}</p>
        <p>ISBN: {data.isbn}</p>
        <p>Stock: {data.stock}</p>
        <p>Category: {data.category}</p>
        <p>{data.description}</p>
        <p>{data.isAvailable ? "Available" : "Not Available"}</p>
      </div>
    );
  }

  return (
    <div className="book-detail book-detail--masked">
      <h1>{data.title}</h1>
      <p>Status: {data.status}</p>
    </div>
  );
}

export default BookDetail;