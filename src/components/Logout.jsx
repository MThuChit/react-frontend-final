import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useUser();

  useEffect(() => {
    async function performLogout() {
      try {
        // This calls the logout logic in UserProvider 
        // which clears localStorage and the HTTP-only cookie 
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    performLogout();
  }, [logout]);

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Logging out...</h3>
      </div>
    );
  }

  // Redirect to the login path string, not the component 
  return <Navigate to="/login" replace />;
}