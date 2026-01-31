// src/services/authService.js
import axios from 'axios';

// Ensure your .env has VITE_API_URL=http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // Returns { token, user: { id, name, role, email } } from the server
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }
};