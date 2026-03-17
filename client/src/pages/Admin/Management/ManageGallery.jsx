import React, { useEffect, useState } from "react";
import axios from "axios";
import GalleryForm from "./GalleryForm";
import "./ManageGallery.css";

export default function ManageGallery() {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/gallery`;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    caption: "",
    category: "Infrastructure",
    id: null
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  /* FETCH GALLERY */
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setImages(res.data.data || []);
    } catch (err) {
      console.error("Gallery fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* SUBMIT IMAGE */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    
    data.append("caption", formData.caption);
    data.append("category", formData.category);
    if (image) data.append("image", image);

    try {
      setLoadingAction(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      if (isEdit) {
        await axios.put(`${API_URL}/${formData.id}`, data, config);
      } else {
        await axios.post(API_URL, data, config);
      }

      setShowModal(false);
      fetchGallery(); // Refresh grid after upload
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoadingAction(false);
    }
  };

  /* DELETE IMAGE */
  const deleteImage = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGallery(); // Refresh grid after delete
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="manageGalleryPage" style={{ padding: '20px' }}>
      
      <div className="galleryHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Manage Gallery</h2>
        <button
          className="addGalleryBtn"
          style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => {
            setIsEdit(false);
            setFormData({ caption: "", category: "Infrastructure", id: null });
            setPreview("");
            setImage(null);
            setShowModal(true);
          }}
        >
          + Add Image
        </button>
      </div>

      <GalleryForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEdit={isEdit}
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

      {/* ADMIN IMAGE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p>Loading images...</p>
        ) : images.length === 0 ? (
          <p>No images found. Click "+ Add Image" to start!</p>
        ) : (
          images.map((img) => (
            <div key={img._id} style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '12px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <img 
                src={img.image || img.imageUrl || img.url} 
                alt={img.caption} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <h4 style={{ margin: '12px 0 4px 0', fontSize: '18px', color: '#1f2937' }}>{img.caption}</h4>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{img.category}</p>
              
              <button 
                onClick={() => deleteImage(img._id)}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
              >
                Delete Image
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}