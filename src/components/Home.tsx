import { useState } from "react";
import BookList from "./BookList";
import CreateBookModal from "./CreateBookModal";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-page">
      <div className="home-page__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" , fontFamily: 'inter'}}>
        <h1>Books</h1>
        <button onClick={() => setIsModalOpen(true)}>+ Add New Book</button>
      </div>

      <BookList />

      {isModalOpen && <CreateBookModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );

}

export default Home;


