import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api, downloadBookFile } from "../api";
import { Modal } from "./Modal";
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
      <div className="max-w-[500px] my-[20px] mx-[16px] md:my-[40px] md:mx-auto p-[24px] border border-[#e0e0e0] rounded-[8px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] box-border">
        {!isEditing ? (
          <>
            <h1 className="mt-0 mb-2 text-[24px] font-semibold">{data.title}</h1>
            <p className="text-[#666666] text-[16px] mb-2">by {data.author}</p>
            <p className="text-[18px] font-semibold text-[#28a745] mb-2">${data.price}</p>
            <p className="mb-2">
              <strong>ISBN:</strong> {data.isbn}
            </p>
            <p className="mb-2">
              <strong>Stock:</strong> {data.stock}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {data.category}
            </p>
            <p className="mb-2">{data.description}</p>
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

            <div className="flex gap-[10px] mt-[20px] flex-wrap">
              <button
                className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#28a745] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleDownload(data)}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download Book"}
              </button>

              <button
                className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#007bff] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleStartEdit(data)}
              >
                Edit Book
              </button>

              <button
                className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#dc3545] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={deleteBookMutation.isPending}
              >
                {deleteBookMutation.isPending ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </>
        ) : (
          <form className="flex flex-col gap-[14px]" onSubmit={handleUpdateSubmit}>
            <h2 className="mt-0 mb-[8px] text-[20px] font-semibold">Edit Book</h2>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold">Title</label>
              <input
                type="text"
                className="w-full px-[12px] py-[8px] border border-[#cccccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold">Author</label>
              <input
                type="text"
                className="w-full px-[12px] py-[8px] border border-[#cccccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold">Price ($)</label>
              <input
                type="number"
                className="w-full px-[12px] py-[8px] border border-[#cccccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
                value={formData.price ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                min="0"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold">Stock</label>
              <input
                type="number"
                className="w-full px-[12px] py-[8px] border border-[#cccccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
                value={formData.stock ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                required
                min="0"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold">Category</label>
              <select
                className="w-full px-[12px] py-[8px] border border-[#cccccc] rounded-[4px] text-[14px] box-border bg-white outline-none focus:border-[#007bff]"
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

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold">Description</label>
              <textarea
                className="w-full px-[12px] py-[8px] border border-[#cccccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {updateBookMutation.isError && (
              <p className="text-red-500 text-sm">{updateBookMutation.error.message}</p>
            )}

            <div className="flex gap-[10px] mt-[10px] flex-wrap">
              <button
                type="submit"
                className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#007bff] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={updateBookMutation.isPending}
              >
                {updateBookMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#6c757d] disabled:opacity-60 disabled:cursor-not-allowed"
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
    <div className="max-w-[500px] my-[20px] mx-[16px] md:my-[40px] md:mx-auto p-[24px] border border-[#e0e0e0] rounded-[8px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] box-border">
      <h1 className="mt-0 mb-2 text-[24px] font-semibold">{data.title}</h1>
      <p>Status: {data.status}</p>
    </div>
  );
}

export default BookDetail;