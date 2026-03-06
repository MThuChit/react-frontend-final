import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function NavBar() {
  const { user } = useUser();

  return (
    <nav className="app-nav">
      <div className="nav-left">
        <Link className="brand" to="/">Library</Link>
        {user.isLoggedIn && <Link className="nav-link" to="/books">Books</Link>}
        {user.isLoggedIn && user.role === "USER" && (
          <Link className="nav-link" to="/borrow">Borrow</Link>
        )}
      </div>

      <div className="nav-right">
        {user.isLoggedIn ? (
          <>
            <span style={{ color: '#ccc', marginRight: 8 }}>{user.name || user.email}</span>
            <Link className="nav-link" to="/logout">Logout</Link>
          </>
        ) : (
          <Link className="nav-link" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
