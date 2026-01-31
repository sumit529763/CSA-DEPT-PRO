import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });

    // Save token in browser
    localStorage.setItem("token", response.data.token);

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  }
};
