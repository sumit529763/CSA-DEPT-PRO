import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NewsForm from "./NewsForm";
import "./ManageNews.css";

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
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news`;
  const token = localStorage.getItem("token");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setNews(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [location.key]);

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
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="manageNewsPage">

      {/* HEADER */}
      <div className="newsPageHeader">
        <div>
          <h2>Manage News</h2>
          <p>Create, update and manage department news</p>
        </div>

        <button className="addNewsBtn" onClick={handleOpenAdd}>
          + Add News
        </button>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div className="loadingBox">Loading...</div>
      ) : news.length === 0 ? (
        <div className="emptyBox">
          <h4>No News Published</h4>
          <p>Click Add News to create your first article</p>
        </div>
      ) : (
        <div className="newsGrid">
          {news.map((item) => (
            <div className="newsCard" key={item._id}>

              <img src={item.image} alt="" />

              <div className="newsCardBody">
                <h4>{item.title}</h4>

                <div className="newsActions">
                  <button onClick={() => handleOpenEdit(item)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      <NewsForm
        show={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEditMode}
        loading={loadingAction}
        formData={formData}
        setFormData={setFormData}
        preview={preview}
        onImageChange={(e)=>{
          const file = e.target.files[0];
          if(file){
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

    </div>
  );
}
