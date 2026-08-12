import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiFetch } from "../api";
import type { BookListResponse } from "../types";
import { Link } from "react-router-dom";

function BookList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading, isFetching, error } = useQuery<BookListResponse>({
    queryKey: ["books", page, search, category],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      return apiFetch(`/api/books?${params.toString()}`);
    },
  });

  return (
    <div className="book-list">
      <div className="book-list__filters">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Biography">Biography</option>
          <option value="Self-Help">Self-Help</option>
        </select>
        {isFetching && (
          <p style={{ marginLeft: "10px" }}>Searching...</p>
        )}
      </div>

      {error && (
        <p style={{ color: "red" }}>
          {error instanceof Error ? error.message : "Failed to load books"}
        </p>
      )}

      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <div className="book-list__grid">
            {data?.data.map((book) => (
              <Link
                to={`/books/${book._id}`}
                key={book._id}
                className="book-card"
              >
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>${book.price}</p>
              </Link>
            ))}
          </div>

          {data?.data.length === 0 && <p>No books found.</p>}

          <div className="book-list__pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <span>
              Page {data?.page} of {data?.pages}
            </span>
            <button
              disabled={data ? page >= data.pages : true}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BookList;
