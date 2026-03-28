import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NewsForm from "./NewsForm";
import "./ManageNews.css";

export default function ManageNews() {
  const [news, setNews]               = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [isEditMode, setIsEditMode]   = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [search, setSearch]           = useState("");

  const [formData, setFormData] = useState({ title: "", description: "", id: null });
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState("");

  const location = useLocation();
  const API_URL  = `${import.meta.env.VITE_API_BASE_URL}/api/news`;

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(API_URL);
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
    if (search)
      temp = temp.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredNews(temp);
  }, [search, news]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data  = new FormData();
    data.append("title",       formData.title);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      setLoadingAction(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      if (isEditMode) await axios.put(`${API_URL}/${formData.id}`, data, config);
      else            await axios.post(API_URL, data, config);
      setShowModal(false);
      fetchNews();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
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

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || "Error"));
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        })
      : "—";

  return (
    <div className="news-page">

      {/* HEADER */}
      <div className="news-header">
        <div>
          <h2>Manage News</h2>
          <p>Create, update and manage department news &amp; articles</p>
        </div>
        <button className="news-add-btn" onClick={handleOpenAdd}>
          <i className="fas fa-plus" />
          <span>Add News</span>
        </button>
      </div>

      {/* STATS */}
      <div className="news-stats">
        <div className="news-stat">
          <i className="fas fa-newspaper news-stat-icon" />
          <div className="news-stat-info">
            <span className="news-stat-num">{news.length}</span>
            <span className="news-stat-label">Total Articles</span>
          </div>
        </div>
        <div className="news-stat">
          <i className="fas fa-calendar-alt news-stat-icon" />
          <div className="news-stat-info">
            <span className="news-stat-num">
              {news.filter((n) => {
                const d = new Date(n.createdAt);
                const now = new Date();
                return (
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              }).length}
            </span>
            <span className="news-stat-label">This Month</span>
          </div>
        </div>
        <div className="news-stat">
          <i className="fas fa-image news-stat-icon" />
          <div className="news-stat-info">
            <span className="news-stat-num">
              {news.filter((n) => n.image).length}
            </span>
            <span className="news-stat-label">With Image</span>
          </div>
        </div>
        <div className="news-stat">
          <i className="fas fa-search news-stat-icon" />
          <div className="news-stat-info">
            <span className="news-stat-num">{filteredNews.length}</span>
            <span className="news-stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="news-toolbar">
        <div className="news-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search news…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="news-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        {!loading && (
          <p className="news-count">
            <strong>{filteredNews.length}</strong> article
            {filteredNews.length !== 1 ? "s" : ""}
            {search && (
              <span>
                {" "}matching "<strong>{search}</strong>"
              </span>
            )}
          </p>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="news-skeletons">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="news-skeleton-card">
              <div className="sk sk-img" />
              <div className="sk-body">
                <div className="sk sk-title" />
                <div className="sk sk-line" />
                <div className="sk sk-line short" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="news-empty">
          <i className="fas fa-inbox" />
          <h4>No News Found</h4>
          <p>
            {search
              ? `No results for "${search}"`
              : 'Click "Add News" to create your first article'}
          </p>
        </div>
      ) : (
        <div className="news-grid">
          {filteredNews.map((item, idx) => (
            <div className="news-card" key={item._id}>
              {/* IMAGE */}
              <div className="nc-image">
                <img
                  src={item.image || "https://placehold.co/400x200/e8edff/2554f0?text=No+Image"}
                  alt={item.title}
                />
                <div className="nc-index">#{idx + 1}</div>
                <div className="nc-overlay">
                  <button
                    className="nc-btn-edit"
                    onClick={() => handleOpenEdit(item)}
                  >
                    <i className="fas fa-edit" /> Edit
                  </button>
                  <button
                    className="nc-btn-delete"
                    onClick={() => handleDelete(item._id, item.title)}
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="nc-body">
                <p className="nc-title">{item.title}</p>
                <p className="nc-desc">
                  {item.description?.slice(0, 100)}
                  {item.description?.length > 100 ? "…" : ""}
                </p>
                <div className="nc-footer">
                  <span className="nc-date">
                    <i className="fas fa-clock" /> {formatDate(item.createdAt)}
                  </span>
                  <div className="nc-actions">
                    <button
                      className="exam-btn-edit"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <i className="fas fa-edit" /> <span>Edit</span>
                    </button>
                    <button
                      className="exam-btn-delete"
                      onClick={() => handleDelete(item._id, item.title)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
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
          const f = e.target.files[0];
          if (f) {
            setImage(f);
            setPreview(URL.createObjectURL(f));
          }
        }}
      />
    </div>
  );
}