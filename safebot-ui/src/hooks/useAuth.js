// useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContex';

/**
 * Custom hook to access the authentication context.
 * Provides user data, loading state, error, and login/logout functions.
 * Throws an error if used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Ensure the hook is used within an AuthProvider
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
