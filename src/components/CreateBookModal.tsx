import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";

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
    mutationFn: (formData: FormData) =>
      apiFetch("/api/books", {
        method: "POST",
        body: formData,
      }),
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
    <div>
      <div>
        <h2>Add New Book</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />

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

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Upload Book File:
            </label>
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

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
