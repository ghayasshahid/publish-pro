import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Modal } from "./Modal";

interface CreateBookModalProps {
  onClose: () => void;
}

interface BookFormValues {
  // Step 1: Basic Information
  title: string;
  author: string;
  isbn: string;
  // Step 2: Pricing & Category
  price: string;
  stock: string;
  category: string;
  // Step 3: Details & Upload
  description: string;
  file: FileList;
}

const TOTAL_STEPS = 3;

// Map step numbers to the specific fields that need validation before moving forward
const STEP_FIELDS: Record<number, (keyof BookFormValues)[]> = {
  1: ["title", "author", "isbn"],
  2: ["price", "stock", "category"],
  3: ["description", "file"],
};

export default function CreateBookModal({ onClose }: CreateBookModalProps) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<BookFormValues>({
    shouldUnregister: false, // Preserves data from hidden steps
    defaultValues: {
      stock: "1",
      category: "Education",
    },
  });

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

  // Validates only the current step's fields before advancing
  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: BookFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("isbn", data.isbn);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category", data.category);
    formData.append("description", data.description || "");
    formData.append("file", data.file[0]);

    createBookMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/40 flex justify-center items-center z-50 p-4 box-border">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg shadow-md box-border max-h-[90vh] overflow-y-auto">
        
        {/* Header & Step Counter */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="m-0 text-xl font-semibold text-gray-900">Add New Book</h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full mb-5 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          
          {/* ================= STEP 1: Basic Info ================= */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Title</label>
                <input
                  type="text"
                  placeholder="Book Title"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">{errors.title.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Author</label>
                <input
                  type="text"
                  placeholder="Author Name"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                  {...register("author", { required: "Author is required" })}
                />
                {errors.author && (
                  <span className="text-red-500 text-xs">{errors.author.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">ISBN</label>
                <input
                  type="text"
                  placeholder="ISBN"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                  {...register("isbn", { required: "ISBN is required" })}
                />
                {errors.isbn && (
                  <span className="text-red-500 text-xs">{errors.isbn.message}</span>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: Pricing & Category ================= */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Price ($)</label>
                <input
                  type="number"
                  placeholder="Price ($)"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                  min="0"
                  step="0.01"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                />
                {errors.price && (
                  <span className="text-red-500 text-xs">{errors.price.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                  min="0"
                  {...register("stock", {
                    required: "Stock quantity is required",
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                />
                {errors.stock && (
                  <span className="text-red-500 text-xs">{errors.stock.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Category</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-white box-border outline-none focus:border-blue-600"
                  {...register("category")}
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
            </div>
          )}

          {/* ================= STEP 3: Details & File Upload ================= */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Description</label>
                <textarea
                  placeholder="Description (optional)"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border outline-none focus:border-blue-600"
                  rows={3}
                  {...register("description")}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">Upload Book File:</label>
                <input
                  type="file"
                  accept=".pdf,.epub,.mobi,.doc,.docx"
                  className="w-full p-2 border border-gray-300 rounded text-sm box-border cursor-pointer file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  {...register("file", {
                    required: "Please select a book file to upload.",
                  })}
                />
                {errors.file && (
                  <span className="text-red-500 text-xs">{errors.file.message}</span>
                )}
              </div>
            </div>
          )}

          {/* Server Error Message */}
          {createBookMutation.isError && (
            <p className="text-red-500 text-sm m-0">
              {createBookMutation.error.message}
            </p>
          )}

          {/* ================= Step Navigation Buttons ================= */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            {/* Left Action: Cancel on step 1, Back on steps 2 & 3 */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                disabled={createBookMutation.isPending}
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors"
                disabled={createBookMutation.isPending}
              >
                Cancel
              </button>
            )}

            {/* Right Action: Next on steps 1 & 2, Submit on step 3 */}
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={createBookMutation.isPending}
                className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {createBookMutation.isPending ? "Uploading..." : "Save Book"}
              </button>
            )}
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