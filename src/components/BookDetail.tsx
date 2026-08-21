import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api, downloadBookFile } from "../api";
import { Modal } from "./Modal";
import type { BookDetailResponse, Book } from "../types";
import { useAuth } from "../hooks/useAuth";

function isFullBook(book: BookDetailResponse): book is Book {
  return "price" in book;
}

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const [confirm, setConfirm] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const { data, isLoading, error } = useQuery<BookDetailResponse>({
    queryKey: ["book", id],
    queryFn: () => api.get(`/api/books/${id}`).then((res) => res.data),
  });

  // Calculate isOwner
  const isOwner = data && isFullBook(data) && (
    (typeof data.createdBy === "object" && data.createdBy?._id === user?.id) ||
    data.createdBy === user?.id
  );

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
    setConfirm({
      isOpen: true,
      message: "Are you sure you want to delete this book?",
      onConfirm: () => {
        deleteBookMutation.mutate();
      },
    });
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
      <p className="text-red-500 text-sm">
        {error instanceof Error ? error.message : "Failed to load book"}
      </p>
    );
  }
  if (!data) return null;

  if (isFullBook(data)) {
    return (
      <div className="max-w-lg my-5 mx-4 md:my-10 md:mx-auto p-6 border border-gray-200 rounded-lg bg-white shadow-sm box-border">
        {!isEditing ? (
          <>
            <h1 className="mt-0 mb-2 text-2xl font-semibold text-gray-900">
              {data.title}
            </h1>
            <p className="text-gray-600 text-base mb-2">by {data.author}</p>
            <p className="text-lg font-semibold text-green-600 mb-2">
              ${data.price}
            </p>
            <p className="mb-2">
              <strong>ISBN:</strong> {data.isbn}
            </p>
            <p className="mb-2">
              <strong>Stock:</strong> {data.stock}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {data.category}
            </p>
            <p className="mb-2 text-gray-700">{data.description}</p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              {data.isAvailable ? "Available" : "Not Available"}
            </p>

            {(deleteBookMutation.isError ||
              updateBookMutation.isError ||
              downloadError) && (
              <p className="text-red-500 text-sm mt-2">
                {deleteBookMutation.error?.message ||
                  updateBookMutation.error?.message ||
                  downloadError}
              </p>
            )}

            <div className="flex gap-2.5 mt-5 flex-wrap">
              <button
                className="px-4 py-2 border-0 rounded cursor-pointer text-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                onClick={() => handleDownload(data)}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download Book"}
              </button>

              {isOwner && (
                <button
                  className="px-4 py-2 border-0 rounded cursor-pointer text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  onClick={() => handleStartEdit(data)}
                >
                  Edit Book
                </button>
              )}

              <button
                className="px-4 py-2 border-0 rounded cursor-pointer text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                onClick={handleDelete}
                disabled={deleteBookMutation.isPending}
              >
                {deleteBookMutation.isPending ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </>
        ) : (
          <form className="flex flex-col gap-3.5" onSubmit={handleUpdateSubmit}>
            <h2 className="mt-0 mb-2 text-xl font-semibold text-gray-900">
              Edit Book
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Author
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Price ($)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                value={formData.price ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                min="0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Stock
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                value={formData.stock ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                required
                min="0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm box-border bg-white outline-none focus:border-blue-600"
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {updateBookMutation.isError && (
              <p className="text-red-500 text-sm">
                {updateBookMutation.error.message}
              </p>
            )}

            <div className="flex gap-2.5 mt-2.5 flex-wrap">
              <button
                type="submit"
                className="px-4 py-2 border-0 rounded cursor-pointer text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                disabled={updateBookMutation.isPending}
              >
                {updateBookMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="px-4 py-2 border-0 rounded cursor-pointer text-sm text-white bg-gray-500 hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <Modal
          isOpen={confirm.isOpen}
          message={confirm.message}
          onClose={() => setConfirm({ ...confirm, isOpen: false })}
          onConfirm={confirm.onConfirm}
          type="confirm"
        />
      </div>
    );
  }

  return (
    <div className="max-w-lg my-5 mx-4 md:my-10 md:mx-auto p-6 border border-gray-200 rounded-lg bg-white shadow-sm box-border">
      <h1 className="mt-0 mb-2 text-2xl font-semibold">{data.title}</h1>
      <p>Status: {data.status}</p>
    </div>
  );
}

export default BookDetail;
