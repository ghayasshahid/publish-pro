import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./components/Home";
import BookDetail from "./components/BookDetail";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/books/:id" element={<BookDetail />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
