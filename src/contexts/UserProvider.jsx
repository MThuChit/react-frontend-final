import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  const initialUser = {
    isLoggedIn: false,
    name: "",
    email: "",
    role: "", // Added role to satisfy Requirement 2 & 11
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(initialUser);

  // Requirement: Load session on mount so page refresh doesn't log user out
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  const login = async (email, password) => {
    // TODO: Implement login mechanism
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        // Requirement: credentials "include" to handle HTTP-only cookies
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const newUser = {
          isLoggedIn: true,
          name: data.user.name || email.split("@")[0],
          email: data.user.email,
          role: data.user.role, // Essential for Requirement 11 (display services)
        };
        setUser(newUser);
        localStorage.setItem("session", JSON.stringify(newUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server connection error" };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      const newUser = { isLoggedIn: false, name: "", email: "", role: "" };
      setUser(newUser);
      localStorage.removeItem("session");
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}