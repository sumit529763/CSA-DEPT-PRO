import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/notices`;

const getToken = () => localStorage.getItem("token");

// 🌐 PUBLIC: Fetch all published notices (optional type filter)
export const fetchAllNotices = (type = "") => {
  const url = type ? `${API_URL}?type=${type}` : API_URL;
  return axios.get(url);
};

// 🔐 ADMIN: Fetch all notices including unpublished
export const fetchAllNoticesAdmin = () => {
  return axios.get(`${API_URL}/admin/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// 🔐 ADMIN: Create a new notice (formData supports file upload)
export const createNotice = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔐 ADMIN: Update a notice
export const updateNotice = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔐 ADMIN: Delete a notice
export const deleteNotice = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};