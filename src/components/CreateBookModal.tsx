import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

interface CreateBookModalProps {
  onClose: () => void;
}

export default function CreateBookModal({ onClose }: CreateBookModalProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [category, setCategory] = useState("Fiction");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const createBookMutation = useMutation({
    mutationFn: (formData: FormData) => api.post("/api/books", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a book file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("isbn", isbn);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("file", file);

    createBookMutation.mutate(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Book</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              placeholder="Stock Quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Upload Book File:</label>
            <input
              type="file"
              accept=".pdf,.epub,.mobi,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          {createBookMutation.isError && (
            <p style={{ color: "red", margin: 0 }}>
              {createBookMutation.error.message}
            </p>
          )}

          <div className="modal-actions">
            <button type="submit" disabled={createBookMutation.isPending}>
              {createBookMutation.isPending ? "Uploading..." : "Save Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={createBookMutation.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
