import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Modal } from "./Modal";

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

  const [alert, setAlert] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

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
      setAlert({ isOpen: true, message: "Please select a book file to upload." });
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
    <div className="fixed inset-0 w-screen h-screen bg-black/40 flex justify-center items-center z-[1000] p-[16px] box-border">
      <div className="bg-white p-[16px] sm:p-[24px] rounded-[8px] w-full max-w-[480px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] box-border max-h-[90vh] overflow-y-auto">
        <h2 className="mt-0 mb-[16px] text-[20px] font-semibold">Add New Book</h2>

        <form className="flex flex-col gap-[12px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Title</label>
            <input
              type="text"
              placeholder="Book Title"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Author</label>
            <input
              type="text"
              placeholder="Author"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">ISBN</label>
            <input
              type="text"
              placeholder="ISBN"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Price ($)</label>
            <input
              type="number"
              placeholder="Price ($)"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Stock Quantity</label>
            <input
              type="number"
              placeholder="Stock Quantity"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Category</label>
            <select
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] bg-white box-border outline-none focus:border-[#007bff]"
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

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Description</label>
            <textarea
              placeholder="Description (optional)"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border outline-none focus:border-[#007bff]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className="text-[14px] font-semibold">Upload Book File:</label>
            <input
              type="file"
              accept=".pdf,.epub,.mobi,.doc,.docx"
              className="w-full p-[8px] border border-[#ccc] rounded-[4px] text-[14px] box-border cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          {createBookMutation.isError && (
            <p className="text-red-500 text-sm m-0">
              {createBookMutation.error.message}
            </p>
          )}

          <div className="flex gap-[10px] mt-[12px]">
            <button
              type="submit"
              className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#007bff] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={createBookMutation.isPending}
            >
              {createBookMutation.isPending ? "Uploading..." : "Save Book"}
            </button>
            <button
              type="button"
              className="px-[16px] py-[8px] border-0 rounded-[4px] cursor-pointer text-[14px] text-white bg-[#6c757d] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={createBookMutation.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={alert.isOpen}
        message={alert.message}
        onClose={() => setAlert({ isOpen: false, message: "" })}
        type="alert"
      />
    </div>
  );
}