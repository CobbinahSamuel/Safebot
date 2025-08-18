import React, { createContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

// Create the authentication context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State to hold user information, initialized from session storage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('adminUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user from session storage:", error);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false); // Indicates if an auth operation is in progress
  const [error, setError] = useState(null); // Stores any error messages
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Effect to synchronize user state with session storage
  useEffect(() => {
    console.log("AuthContext: User state changed. New user:", user);
    if (user) {
      // Save user to session storage when user state changes
      sessionStorage.setItem('adminUser', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      // Remove user from session storage if user state is null (logged out)
      sessionStorage.removeItem('adminUser');
      setIsAuthenticated(false);
    }
  }, [user]); // Dependency array: runs when 'user' state changes

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const userData = await authApi.loginAdmin(email, password);
      // Assuming your backend returns a user object on successful login
      setUser({ ...userData, role: 'admin' });
      setIsLoading(false);
      return true; // Login successful
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || 'An unexpected error occurred during login.');
      setUser(null); // Clear user on login failure
      setIsLoading(false);
      return false; // Login failed
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      await authApi.logoutAdmin();
      setUser(null); // Clear user on successful logout
      setIsLoading(false);
      return true; // Logout successful
    } catch (err) {
      console.error("Logout Error:", err);
      setError(err.message || 'An unexpected error occurred during logout.');
      setIsLoading(false);
      return false; // Logout failed
    }
  };

  // Derived state to easily check if the user is an admin
  const isAdmin = user && user.role === 'admin';

  // Value provided by the context to consuming components
  const authContextValue = {
    user,       // Current logged-in user data (or null)
    isAuthenticated, // Boolean: true if a user is logged in
    isAdmin,    // Boolean: true if user is admin, false otherwise
    isLoading,  // Boolean: true if an auth operation is in progress
    error,      // String: current error message (or null)
    login,      // Function to initiate login
    logout,     // Function to initiate logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
