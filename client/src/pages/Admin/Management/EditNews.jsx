import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/Management.css";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch existing news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/news/${id}`
        );

        setTitle(res.data.data.title);
        setDescription(res.data.data.description);
        setPreview(res.data.data.image);
      } catch {
        alert("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await axios.put(
        `http://localhost:5000/api/news/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/admin/manage/news");
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="management-view">
      <h2>Edit News</h2>

      <form onSubmit={handleSubmit} className="form-card">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Current Image</label>
        {preview && <img src={preview} alt="" width="120" />}

        <label>Replace Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="form-actions">
          <button type="submit" className="btn-add">
            Update News
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/manage/news")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
