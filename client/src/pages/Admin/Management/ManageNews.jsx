import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NewsForm from "./NewsForm";
import "./ManageNews.css";

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({ title: "", description: "", id: null });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const location = useLocation();
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news`;

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const data = res.data.data || [];
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNews(sorted);
      setFilteredNews(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [location.key]);

  useEffect(() => {
    let temp = [...news];
    if (search) {
      temp = temp.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredNews(temp);
  }, [search, news]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get fresh token
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      setLoadingAction(true);
      
      const config = {
        headers: {
          // Format must be "Bearer <token>" exactly
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
    } catch (err) {
      console.error("Submission Error:", err.response);
      // If "Token failed", it likely means the JWT_SECRET is mismatched
      alert(err.response?.data?.message || "Token failed: Check your connection or login again.");
    } finally {
      setLoadingAction(false);
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this news?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNews();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || "Unauthorized"));
    }
  };

  return (
    <div className="manageNewsPage">
      <div className="newsPageHeader">
        <div>
          <h2>Manage News</h2>
          <p>Create, update and manage department news</p>
        </div>
        <button className="addNewsBtn" onClick={handleOpenAdd}>+ Add News</button>
      </div>
      <div className="newsTools">
        <input placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="loadingBox">Loading news...</div>
      ) : filteredNews.length === 0 ? (
        <div className="emptyBox">
          <h4>No News Published</h4>
          <p>Click Add News to create your first article</p>
        </div>
      ) : (
        <div className="newsGrid">
          {filteredNews.map(item => (
            <div className="newsCard" key={item._id}>
              <div className="newsImage">
                <img src={item.image || "https://via.placeholder.com/400"} alt={item.title} />
                <div className="newsOverlay">
                  <button onClick={() => handleOpenEdit(item)}><i className="fas fa-edit"></i></button>
                  <button className="delete" onClick={() => handleDelete(item._id)}><i className="fas fa-trash"></i></button>
                </div>
              </div>
              <div className="newsCardBody">
                <h4>{item.title}</h4>
                <p>{item.description?.slice(0, 90)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <NewsForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
        loading={loadingAction}
        formData={formData}
        setFormData={setFormData}
        preview={preview}
        onImageChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}