import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    errorMessage: ""
  });

  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin() {
    // Reset error state and start loading
    setControlState({
      isLoggingIn: true,
      isLoginError: false,
      errorMessage: ""
    });

    const email = emailRef.current.value;
    const pass = passRef.current.value;

    // Call the login function from UserProvider
    const result = await login(email, pass);

    if (result.success) {
      setControlState({
        isLoggingIn: false,
        isLoginError: false,
        errorMessage: ""
      });
    } else {
      setControlState({
        isLoggingIn: false,
        isLoginError: true,
        errorMessage: result.message || "Login incorrect"
      });
    }
  }

  // If already logged in, redirect to profile or home
  if (user.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container" style={{ maxWidth: 480 }}>
      <h2>Library Management System Login</h2>
      <div style={{ border: '1px solid #333', padding: 16, borderRadius: 8, background: '#121212' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label>Email</label>
          <input type="text" ref={emailRef} defaultValue="admin@test.com" placeholder="admin@test.com" style={{ padding: 8 }} />
          <label>Password</label>
          <input type="password" ref={passRef} defaultValue="admin123" placeholder="admin123" style={{ padding: 8 }} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button onClick={onLogin} disabled={controlState.isLoggingIn}>
              {controlState.isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </div>
          {controlState.isLoginError && (
            <div style={{ color: "#ff6b6b", marginTop: "10px", textAlign: 'center' }}>
              {controlState.errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}