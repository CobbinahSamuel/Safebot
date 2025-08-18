// authApi.js
// Make sure you have Axios installed: npm install axios

import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`; // Your API base URL, e.g., 'http://localhost:5000'

const authApi = {
  /**
   * Sends a login request for an admin to the backend.
   * Uses Axios for HTTP requests.
   * @param {string} email - The admin's email.
   * @param {string} password - The admin's password.
   * @returns {Promise<object>} A promise that resolves with user data if successful.
   * @throws {Error} If the login fails (e.g., network error, invalid credentials).
   */
  loginAdmin: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, { email, password });
      return response.data; // Axios wraps the actual response data in a 'data' property
    } catch (error) {
      // Axios errors have a 'response' property for HTTP errors
      // and 'message' for network errors etc.
      console.error('Login API Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred during login.');
      }
    }
  },

  /**
   * Sends a logout request for an admin to the backend.
   * Uses Axios for HTTP requests.
   * @returns {Promise<object>} A promise that resolves with a success message if successful.
   * @throws {Error} If the logout fails.
   */
  logoutAdmin: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/logout`);
      return response.data;
    } catch (error) {
      console.error('Logout API Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred during logout.');
      }
    }
  },
};

export default authApi;
