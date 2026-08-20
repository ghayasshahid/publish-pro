import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api";
import type { BookListResponse } from "../types";
import { Link } from "react-router-dom";

function BookList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading, error } = useQuery<BookListResponse>({
    queryKey: ["books", page, search, category],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      return api.get(`/api/books?${params.toString()}`).then((res) => res.data);
    },
  });

  return (
    
    <div className="flex flex-col gap-6 w-full box-border">
      
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <input
          type="text"
          placeholder="Search by title or author"
          className="flex-1 px-3 py-2 border border-[#ccc] rounded text-sm outline-none focus:border-[#007bff] box-border"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-3 py-2 border border-[#ccc] rounded text-sm bg-white outline-none focus:border-[#007bff] box-border min-w-[160px]"
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
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error instanceof Error ? error.message : "Failed to load books"}
        </p>
      )}

      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {data?.data.map((book) => (
              <Link
                to={`/books/${book._id}`}
                key={book._id}
                className="p-4 border border-[#e0e0e0] rounded-md bg-white text-inherit no-underline flex flex-col gap-2 box-border hover:border-[#007bff] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all"
              >
                <h3 className="m-0 text-[20px] font-semibold text-gray-900">
                  {book.title}
                </h3>
                <p className="m-0 text-[#666] text-sm">By {book.author}</p>
                <p className="m-0 text-[#666] text-sm font-medium">${book.price}</p>
              </Link>
            ))}
          </div>

          {data?.data.length === 0 && <p>No books found.</p>}

          
          <div className="flex justify-center items-center gap-4 py-6">
            <button
              className="px-4 py-2 border border-[#ccc] bg-white rounded cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="mx-2 text-sm text-gray-700">
              Page {data?.page} of {data?.pages}
            </span>
            <button
              className="px-4 py-2 border border-[#ccc] bg-white rounded cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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