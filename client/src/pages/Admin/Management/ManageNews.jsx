import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NewsForm from "./NewsForm"; 
import "../Styles/Management.css";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({ title: "", description: "", id: null });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const location = useLocation();
  const API_URL = "http://localhost:5000/api/news";
  const token = localStorage.getItem("token");

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

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ title: "", description: "", id: null });
    setPreview("");
    setImage(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setFormData({ title: item.title, description: item.description, id: item._id });
    setPreview(item.image);
    setImage(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large! Max 2MB allowed.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/${formData.id}`, data, config);
      } else {
        await axios.post(API_URL, data, config);
      }
      setShowModal(false);
      fetchNews();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Operation failed"));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
    } catch (error) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchNews();
  }, [location.key]);

  return (
    <div className="management-view">
      <div className="management-header">
        <div className="header-text">
          <h2>Manage News</h2>
          <p>Create, update, or remove department news articles.</p>
        </div>
        <button className="btn-add" onClick={handleOpenAdd}>
          <i className="fas fa-plus"></i> Add New News
        </button>
      </div>

      <div className="content-container">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Loading...
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="table-wrapper desktop-only">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item._id}>
                      <td><img src={item.image} alt="" className="table-thumb" /></td>
                      <td className="font-bold">{item.title}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleOpenEdit(item)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="mobile-only card-list">
              {news.map((item) => (
                <div className="news-mobile-card" key={item._id}>
                  <img src={item.image} alt="" className="card-img" />
                  <div className="card-content">
                    <h4 className="card-title">{item.title}</h4>
                    <div className="card-actions">
                      <button className="btn-edit-mobile" onClick={() => handleOpenEdit(item)}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="btn-delete-mobile" onClick={() => handleDelete(item._id)}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <NewsForm 
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
        loading={loadingAction}
        formData={formData}
        setFormData={setFormData}
        preview={preview}
        onImageChange={handleImageChange}
      />
    </div>
  );
}