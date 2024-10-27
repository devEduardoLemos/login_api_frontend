// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Navbar() {
  const { isAuthenticated, logout, userRole, userId } = useAuth(); // Access auth state and logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function
    navigate('/login'); // Redirect to login
  };

  return (
    <nav style={{ display: 'flex', gap: '10px', padding: '10px' }}>
      <Link to="/">Home</Link>

      {/* Conditionally render Users and Dashboard links */}
      {isAuthenticated &&
      (userRole === 'ROLE_SUPERADMIN' ? (
        <Link to="/users">Users</Link>
      ):(
        <Link to={`/users/${userId}`}>User Detail</Link>
      ))}

      {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}

      {/* Conditionally render Login or Logout */}
      {!isAuthenticated ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;
