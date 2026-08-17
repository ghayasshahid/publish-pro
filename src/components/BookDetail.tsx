import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api, downloadBookFile } from "../api";
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
    queryFn: () => api.get(`/api/books/${id}`).then((res) => res.data),
  });

  const deleteBookMutation = useMutation({
    mutationFn: () => api.delete(`/api/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/home");
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: (updatedFields: Partial<Book>) =>
      api.put(`/api/books/${id}`, updatedFields),
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
            <p className="book-detail__author">by {data.author}</p>
            <p className="book-detail__price">${data.price}</p>
            <p>
              <strong>ISBN:</strong> {data.isbn}
            </p>
            <p>
              <strong>Stock:</strong> {data.stock}
            </p>
            <p>
              <strong>Category:</strong> {data.category}
            </p>
            <p className="book-detail__description">{data.description}</p>
            <p>
              <strong>Status:</strong>{" "}
              {data.isAvailable ? "Available" : "Not Available"}
            </p>

            {(deleteBookMutation.isError ||
              updateBookMutation.isError ||
              downloadError) && (
              <p style={{ color: "red" }}>
                {deleteBookMutation.error?.message ||
                  updateBookMutation.error?.message ||
                  downloadError}
              </p>
            )}

            <div className="book-detail__actions">
              <button
                className="book-detail__btn book-detail__btn--download"
                onClick={() => handleDownload(data)}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download Book"}
              </button>

              <button
                className="book-detail__btn book-detail__btn--edit"
                onClick={() => handleStartEdit(data)}
              >
                Edit Book
              </button>

              <button
                className="book-detail__btn book-detail__btn--delete"
                onClick={handleDelete}
                disabled={deleteBookMutation.isPending}
              >
                {deleteBookMutation.isPending ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </>
        ) : (
          <form className="book-detail__form" onSubmit={handleUpdateSubmit}>
            <h2>Edit Book</h2>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                value={formData.price ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={formData.stock ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
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
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {updateBookMutation.isError && (
              <p style={{ color: "red" }}>{updateBookMutation.error.message}</p>
            )}

            <div className="book-detail__form-actions">
              <button
                type="submit"
                className="book-detail__btn book-detail__btn--save"
                disabled={updateBookMutation.isPending}
              >
                {updateBookMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="book-detail__btn book-detail__btn--cancel"
                onClick={() => setIsEditing(false)}
              >
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
