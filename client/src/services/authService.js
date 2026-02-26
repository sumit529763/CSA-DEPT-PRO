import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const authService = {

  login: async (email, password, captchaToken) => {

    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
      captchaToken
    });

    localStorage.setItem("token", response.data.token);

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  }

};