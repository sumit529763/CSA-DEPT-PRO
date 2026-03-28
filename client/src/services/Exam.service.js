import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/exam`;

const getToken = () => localStorage.getItem("token");

// 🌐 PUBLIC: Fetch by category (Schedules / Results / Resources)
export const fetchByCategory = (category = "") => {
  const url = category ? `${API_URL}?category=${category}` : API_URL;
  return axios.get(url);
};

// 🔐 ADMIN: Fetch all (includes unpublished)
export const fetchAllExamResourcesAdmin = () => {
  return axios.get(`${API_URL}/admin/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// 🔐 ADMIN: Create (formData supports file upload)
export const createExamResource = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔐 ADMIN: Update
export const updateExamResource = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔐 ADMIN: Delete
export const deleteExamResource = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};