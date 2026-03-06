import { useUser } from '../contexts/UserProvider';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const { user } = useUser();
  const location = useLocation();

  // 1. Check if the user is logged in [cite: 47]
  if (!user.isLoggedIn) {
    // Redirect them to the /login page, but save the current location they 
    // were trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Return the children (the protected component) if authenticated [cite: 45]
  return children;
}