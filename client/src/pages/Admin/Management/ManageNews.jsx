import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/Management.css";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = "http://localhost:5000/api/news";
  const token = localStorage.getItem("token");

  // 🔹 Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setNews(res.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create news (popup submit)
  const handleAddNews = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // reset + close modal
      setTitle("");
      setDescription("");
      setImage(null);
      setShowModal(false);

      fetchNews(); // 🔥 auto refresh
    } catch (error) {
      console.error("Publish error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
        "Publish failed – check backend logs"
      );
    }

  };

  // 🔹 Delete news
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNews();
    } catch (error) {
      alert("Failed to delete news");
    }
  };

  // 🔹 Auto refresh on navigation
  useEffect(() => {
    fetchNews();
  }, [location.key]);

  return (
    <div className="management-view">
      {/* ===== HEADER ===== */}
      <div className="management-header">
        <div className="header-text">
          <h2>Manage News</h2>
          <p>Create, update, or remove department news articles.</p>
        </div>

        {/* ✅ FIXED BUTTON */}
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add New News
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-container">
        {loading ? (
          <p>Loading news...</p>
        ) : news.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {news.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt="news" width="70" />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="font-bold">{item.title}</td>

                  <td>
                    <span className="badge">
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="action-btns">
                      {/* ✅ EDIT */}
                      <button
                        className="btn-edit"
                        onClick={() =>
                          navigate(`/admin/manage/news/edit/${item._id}`)
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      {/* ✅ DELETE */}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No news found.</p>
        )}
      </div>

      {/* ===== ADD NEWS MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add New News</h3>

            <form onSubmit={handleAddNews}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <div className="modal-actions">
                <button type="submit" className="btn-add">
                  Publish
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
