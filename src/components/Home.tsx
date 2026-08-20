import { useState } from "react";
import BookList from "./BookList";
import CreateBookModal from "./CreateBookModal";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto p-6 box-border flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <h1 className="m-0 text-3xl font-bold text-gray-900">Books</h1>
        <button
          className="px-4 py-2.5 bg-[#007bff] text-white border-0 rounded cursor-pointer text-sm font-medium hover:bg-[#0056b3] transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Book
        </button>
      </div>

      <BookList />

      {isModalOpen && <CreateBookModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Home;