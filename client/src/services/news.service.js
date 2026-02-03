import axios from "axios";

const API_URL = "http://localhost:5000/api/news";

const getToken = () => localStorage.getItem("token");

// PUBLIC
export const fetchAllNews = () => {
  return axios.get(API_URL);
};

// ADMIN
export const createNews = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteNews = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
