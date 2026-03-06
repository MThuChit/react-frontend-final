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
    <div style={{ padding: "20px" }}>
      <h2>Library Management System Login</h2>
      <table>
        <tbody>
          <tr>
            <th>Email</th>
            <td>
              <input 
                type="text" 
                name="email" 
                id="email" 
                ref={emailRef} 
                placeholder="admin@test.com"
              /> 
            </td>
          </tr>
          <tr>
            <th>Password</th>
            <td>
              <input 
                type="password" 
                name="password" 
                id="password" 
                ref={passRef} 
                placeholder="admin123"
              /> 
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        <button onClick={onLogin} disabled={controlState.isLoggingIn}>
          {controlState.isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </div>
      
      {controlState.isLoginError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {controlState.errorMessage}
        </div>
      )}
    </div>
  );
}