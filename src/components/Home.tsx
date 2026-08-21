import { useState } from "react";
import BookList from "./BookList";
import CreateBookModal from "./CreateBookModal";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6 box-border flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <h1 className="m-0 text-3xl font-bold text-gray-900">Books</h1>
        {user?.role !== "admin" && (
          <button
            className="px-4 py-2.5 bg-blue-600 text-white border-0 rounded cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Book
          </button>
        )}
      </div>

      <BookList />

      {isModalOpen && <CreateBookModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Home;