import { useState } from "react";

export default function TestApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const testConnection = async () => {
    setError(null);
    try {
      // Changed to /api/book to match your backend folder structure
      const response = await fetch(`${API_URL}/api/book`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px", borderRadius: "8px" }}>
      <h3>Library System: API Connection Test</h3>
      <p>Testing endpoint: <code>/api/book</code></p>
      <button onClick={testConnection}>Run Connection Test</button>
      
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          <strong>Connection Failed:</strong> {error}
        </p>
      )}
      
      {data && (
        <div style={{ marginTop: "10px", background: "#f0f0f0", padding: "10px" }}>
          <p style={{ color: "green" }}><strong>Success!</strong> Connected to Backend.</p>
          <pre style={{ fontSize: "12px" }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}