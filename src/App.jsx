import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Books from "./components/Books";
import BookBorrow from "./components/BookBorrow";
import BookDetail from "./components/BookDetail";
import RequireAuth from "./middleware/RequireAuth";
import TestApi from "./components/test_api"; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      
      {/* Protected Routes */}
      <Route path="/books" element={<RequireAuth><Books /></RequireAuth>} />
      <Route path="/books/:id" element={<RequireAuth><BookDetail /></RequireAuth>} />
      <Route path="/borrow" element={<RequireAuth><BookBorrow /></RequireAuth>} />
      
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/books" replace />} />
    </Routes>
  );
}

export default App;