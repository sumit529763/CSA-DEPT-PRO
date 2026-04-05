import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const authService = {
  login: async (email, password, captchaAnswer, num1, num2) => {
    // POST request with all required body fields
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
      captchaAnswer,
      num1,
      num2
    });

    return response.data;
  },

  logout: () => {
    // Clears any logic if needed beyond localStorage
  }
};