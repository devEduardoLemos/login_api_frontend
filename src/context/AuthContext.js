// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null); // Store JWT token

  // Check for stored user data when the app loads
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      setAuthState(storedData); // Set authentication state from stored data
    }
  }, []);

  // Helper function to set authentication state
  const setAuthState = ({ token, id, role }) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
    setToken(token);
  };

  // Login function to store user data upon successful login
  const login = (userData) => {
    const { token, id, role } = userData; // Extract data from login response

    // Store all user information in localStorage as a single object
    localStorage.setItem(
      'userData',
      JSON.stringify({ token, id, role })
    );

    setAuthState({ token, id, role }); // Update authentication state
  };

  // Logout function to clear user data
  const logout = () => {
    localStorage.removeItem('userData'); // Clear user data from storage
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setToken(null);
  };

  // Provide state and functions to components via context
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
