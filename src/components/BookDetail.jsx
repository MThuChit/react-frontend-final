import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    quantity: 0,
    location: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Fetch individual book details [cite: 115]
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/${id}`, {
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();
          setBook(data);
          setFormData({
            title: data.title,
            author: data.author,
            quantity: data.quantity,
            location: data.location
          });
        } else if (response.status === 403) {
          // Requirement 124 & 150: Handle Forbidden response
          alert("Access Denied: You do not have permission to view this book.");
          navigate("/books");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id, API_URL, navigate]);

  // 2. Handle Book Update (Admin Only) [cite: 73, 144]
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "PATCH", // Requirement 116
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (response.ok) {
        alert("Book updated successfully!"); // Requirement 143
        setIsEditing(false);
        setBook({ ...book, ...formData });
      } else {
        const err = await response.json();
        alert(err.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // 3. Handle Soft Delete (Admin Only) [cite: 74, 75, 145]
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "DELETE", // Requirement 117
        credentials: "include"
      });

      if (response.ok) {
        alert("Book deleted (Soft Delete)!"); // Requirement 145
        navigate("/books");
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Book Details</h2>
      
      {isEditing ? (
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          {/* Requirement 65-68: Book fields */}
          <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" required /> 
          <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Author" required /> 
          <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="Quantity" /> 
          <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location" /> 
          
          <div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Quantity:</strong> {book.quantity}</p>
          <p><strong>Location:</strong> {book.location}</p>
          <p><strong>Status:</strong> {book.status}</p>

          {/* Requirement 71-74: Only ADMIN can edit or delete */}
          {user.role === "ADMIN" && (
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setIsEditing(true)} style={{ marginRight: "10px" }}>Edit Book</button> 
              <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>Delete Book</button> 
            </div>
          )}
        </div>
      )}
      
      <button onClick={() => navigate("/books")} style={{ marginTop: "20px" }}>Back to List</button>
    </div>
  );
}