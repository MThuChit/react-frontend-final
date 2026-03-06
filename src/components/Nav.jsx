import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function Nav() {
  const { user } = useUser();

  return (
    <nav className="app-nav">
      <div className="nav-left">
        <NavLink to="/" className="brand">Library</NavLink>
        <NavLink to="/books" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Books</NavLink>
        {user.role === 'ADMIN' && (
          <NavLink to="/books" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Manage</NavLink>
        )}
        {user.role === 'USER' && (
          <NavLink to="/borrow" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Borrow</NavLink>
        )}
      </div>

      <div className="nav-right">
        {user.isLoggedIn ? (
          <>
            <span className="nav-user">{user.name} ({user.role || 'GUEST'})</span>
            <NavLink to="/logout" className="nav-link">Logout</NavLink>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        )}
      </div>
    </nav>
  );
}
