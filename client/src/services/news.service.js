import axios from "axios";

// FIXED: Using the environment variable so it works on both localhost and Render
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news`;

const getToken = () => localStorage.getItem("token");

// 🌐 PUBLIC: Fetch all news
export const fetchAllNews = () => {
  return axios.get(API_URL);
};

// 🔐 ADMIN: Create new news entry
export const createNews = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔐 ADMIN: Delete a news entry
export const deleteNews = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};