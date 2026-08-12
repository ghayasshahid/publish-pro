import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch, downloadBookFile } from "../api";
import type { BookDetailResponse, Book } from "../types";

function isFullBook(book: BookDetailResponse): book is Book {
  return "price" in book;
}

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const { data, isLoading, error } = useQuery<BookDetailResponse>({
    queryKey: ["book", id],
    queryFn: () => apiFetch(`/api/books/${id}`),
  });


  const deleteBookMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/books/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/home");
    },
  });


  const updateBookMutation = useMutation({
    mutationFn: (updatedFields: Partial<Book>) =>
      apiFetch(`/api/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFields),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setIsEditing(false);
    },
  });

  const handleDownload = async (book: Book) => {
    setIsDownloading(true);
    setDownloadError("");
    try {

      const fileName = `${book.title}.pdf`;
      await downloadBookFile(book._id, fileName);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation.mutate();
    }
  };

  const handleStartEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      category: book.category,
      description: book.description,
    });
    setIsEditing(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookMutation.mutate(formData);
  };

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
        {!isEditing ? (
          <>
            <h1>{data.title}</h1>
            <p>by {data.author}</p>
            <p>${data.price}</p>
            <p>ISBN: {data.isbn}</p>
            <p>Stock: {data.stock}</p>
            <p>Category: {data.category}</p>
            <p>{data.description}</p>
            <p>{data.isAvailable ? "Available" : "Not Available"}</p>

            {(deleteBookMutation.isError ||
              updateBookMutation.isError ||
              downloadError) && (
              <p style={{ color: "red" }}>
                {deleteBookMutation.error?.message ||
                  updateBookMutation.error?.message ||
                  downloadError}
              </p>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                onClick={() => handleDownload(data)}
                disabled={isDownloading}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {isDownloading ? "Downloading..." : "Download Book"}
              </button>

              <button
                onClick={() => handleStartEdit(data)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit Book
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteBookMutation.isPending}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {deleteBookMutation.isPending ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleUpdateSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "400px",
            }}
          >
            <h2>Edit Book</h2>

            <label>
              Title:
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>

            <label>
              Author:
              <input
                type="text"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </label>

            <label>
              Price ($):
              <input
                type="number"
                value={formData.price ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                min="0"
              />
            </label>

            <label>
              Stock:
              <input
                type="number"
                value={formData.stock ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                required
                min="0"
              />
            </label>

            <label>
              Category:
              <select
                value={formData.category || "Fiction"}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Self-Help">Self-Help</option>
              </select>
            </label>

            <label>
              Description:
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </label>

            {updateBookMutation.isError && (
              <p style={{ color: "red" }}>{updateBookMutation.error.message}</p>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" disabled={updateBookMutation.isPending}>
                {updateBookMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
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
