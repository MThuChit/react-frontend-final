import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserProvider";

export default function Books() {
  const { user } = useUser();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search states for Requirement 4 & 88-90
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");

  // Form state for Create/Update (Requirement 3)
  const [form, setForm] = useState({ title: "", author: "", quantity: 0, location: "" });
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. Fetch Books (Requirement 4 & 77)
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        title: searchTitle,
        author: searchAuthor
      }).toString();
      
      const response = await fetch(`${API_URL}/api/books?${query}`, {
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTitle, searchAuthor]);

  // 2. Handle Create/Update (Requirement 71-73 & 144)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `${API_URL}/api/books/${editingId}` : `${API_URL}/api/books`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include"
    });

    if (response.ok) {
      setForm({ title: "", author: "", quantity: 0, location: "" });
      setEditingId(null);
      fetchBooks();
    } else if (response.status === 403) {
      alert("Forbidden: Only Admins can perform this action"); // [cite: 124, 150]
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (response.ok) fetchBooks();
  };

  return (
    <div className="page-container">
      <h2>Book Management</h2>

      {/* SEARCH SECTION (Requirement 4) */}
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Search Books</h3>
        <input 
          placeholder="Search by Title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          style={{ padding: 8, marginRight: 8 }}
        />
        <input 
          placeholder="Search by Author" 
          value={searchAuthor} 
          onChange={(e) => setSearchAuthor(e.target.value)} 
          style={{ padding: 8 }}
        />
      </div>

      {/* ADMIN ONLY FORM (Requirement 11 & 153) */}
      {user.role === "ADMIN" && (
        <div style={{ marginBottom: "20px", background: "#f9f9f9", padding: "15px" }}>
          <h3>{editingId ? "Edit Book" : "Add New Book"}</h3>
          <form onSubmit={handleSubmit}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
            <input type="number" placeholder="Qty" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            <button type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && <button onClick={() => {setEditingId(null); setForm({title:"", author:"", quantity:0, location:""})}}>Cancel</button>}
          </form>
        </div>
      )}

      {/* BOOK LIST (Requirement 64-69) */}
      {loading ? <p>Loading books...</p> : (
        <table border="1" width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Qty</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id} style={{ opacity: book.status === "DELETED" ? 0.5 : 1 }}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.quantity}</td>
                <td>{book.location}</td>
                <td>{book.status}</td>
                <td>
                  {user.role === "ADMIN" ? (
                    <>
                      <button onClick={() => {setEditingId(book._id); setForm(book)}} style={{ marginRight: 8 }}>Edit</button>
                      <button onClick={() => handleDelete(book._id)} style={{ color: "white", background: "#c0392b" }}>Delete</button>
                    </>
                  ) : (
                    <span>View Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}