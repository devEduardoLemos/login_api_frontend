// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use AuthContext

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // Access authentication state

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected content)
  return children;
}

export default ProtectedRoute;
