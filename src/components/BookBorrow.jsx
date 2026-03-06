import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserProvider";

export default function BookBorrow() {
  const { user } = useUser();
  const [books, setBooks] = useState([]); // Available books to pick
  const [requests, setRequests] = useState([]); // Existing requests
  const [selectedBook, setSelectedBook] = useState("");
  const [targetDate, setTargetDate] = useState("");
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. Fetch data for the UI
  const fetchData = async () => {
    try {
      // Get books for the dropdown (exclude deleted) [cite: 77]
      const bookRes = await fetch(`${API_URL}/api/books`, { credentials: "include" });
      const bookData = await bookRes.json();
      setBooks(bookData.filter(b => b.status !== "DELETED"));

      // Get borrowing requests [cite: 120]
      const reqRes = await fetch(`${API_URL}/api/borrow`, { credentials: "include" });
      const reqData = await reqRes.json();
      setRequests(reqData);
    } catch (error) {
      console.error("Error fetching data", error, "API_URL:", API_URL);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Submit a new request (Requirement 9) 
  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook, targetDate }),
        credentials: "include"
      });

      if (response.ok) {
        alert("Request submitted!");
        setSelectedBook("");
        setTargetDate("");
        fetchData();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Request error:', error, 'API_URL:', API_URL);
      alert('Server connection error');
    }
  };

  // 3. Admin: Update Status (Requirement 10) 
  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/borrow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus }),
        credentials: "include"
      });

      if (response.ok) fetchData();
      else if (response.status === 403) alert("Unauthorized action");
      else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error, 'API_URL:', API_URL);
      alert('Server connection error');
    }
  };

  return (
    <div className="page-container">
      <h2>Book Borrowing Service</h2>

      {/* USER ONLY: Request Form [cite: 92] */}
      {user.role === "USER" && (
        <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd" }}>
          <h3>Create Borrowing Request</h3>
          <form onSubmit={handleRequest}>
            <label>Select Book: </label>
            <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required style={{ padding: 8 }}>
              <option value="">-- Choose a book --</option>
              {books.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
            </select>
            <br /><br />
            <label>Target Date: </label>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required /> [cite: 96]
            <br /><br />
            <button type="submit">Submit Request</button>
          </form>
        </div>
      )}

      {/* LIST OF REQUESTS (Requirement 120) */}
      <h3>{user.role === "ADMIN" ? "All Borrowing Requests" : "My Requests"}</h3>
      <table border="1" width="100%" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Target Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.email || req.userId}</td> [cite: 94]
              <td>{req.bookTitle}</td>
              <td>{new Date(req.targetDate).toLocaleDateString()}</td> [cite: 96]
              <td style={{ fontWeight: "bold" }}>{req.status}</td> [cite: 97]
              <td>
                {/* ADMIN ACTIONS: ACCEPT, CANCEL, etc. [cite: 101-104, 152] */}
                {user.role === "ADMIN" && req.status === "INIT" && (
                  <>
                    <button onClick={() => updateStatus(req._id, "ACCEPTED")}>Accept</button>
                    <button onClick={() => updateStatus(req._id, "CANCEL-ADMIN")}>Cancel</button>
                    <button onClick={() => updateStatus(req._id, "CLOSE-NO-AVAILABLE-BOOK")}>No Stock</button>
                  </>
                )}
                {/* USER ACTIONS: CANCEL [cite: 104] */}
                {user.role === "USER" && req.status === "INIT" && (
                  <button onClick={() => updateStatus(req._id, "CANCEL-USER")}>Cancel My Request</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}