import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import GalleryForm from "./GalleryForm";
import "./ManageGallery.css";

const CATEGORIES = ["Infrastructure","Events","Sports","Cultural","Academic","Other"];

export default function ManageGallery() {
  const { isSuperAdmin } = useAuth(); // ✅

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/gallery`;
  const [images, setImages]           = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [isEdit, setIsEdit]           = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [search, setSearch]           = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [formData, setFormData] = useState({ caption:"", category:"Infrastructure", id:null });
  const [image, setImage]   = useState(null);
  const [preview, setPreview] = useState("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setImages(res.data.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchGallery(); }, []);

  useEffect(() => {
    let temp = [...images];
    if (activeCategory !== "All") temp = temp.filter((img) => img.category === activeCategory);
    if (search) temp = temp.filter((img) => img.caption?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(temp);
  }, [images, activeCategory, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data  = new FormData();
    data.append("caption",  formData.caption);
    data.append("category", formData.category);
    if (image) data.append("image", image);
    try {
      setLoadingAction(true);
      const config = { headers:{ Authorization:`Bearer ${token}`, "Content-Type":"multipart/form-data" } };
      if (isEdit) await axios.put(`${API_URL}/${formData.id}`, data, config);
      else        await axios.post(API_URL, data, config);
      toast.success(isEdit ? "Image updated!" : "Image uploaded!");
      setShowModal(false); fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally { setLoadingAction(false); }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({ caption:"", category:"Infrastructure", id:null });
    setPreview(""); setImage(null); setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setFormData({ caption:item.caption, category:item.category, id:item._id });
    setPreview(item.image||item.imageUrl||item.url||"");
    setImage(null); setShowModal(true);
  };

  const handleDelete = async (id, caption) => {
    if (!window.confirm(`Delete "${caption}"?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, { headers:{ Authorization:`Bearer ${token}` } });
      toast.success("Image deleted!");
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const categoryCount = (cat) => cat==="All" ? images.length : images.filter((i)=>i.category===cat).length;

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div><h2>Manage Gallery</h2><p>Upload, organise and manage department photo gallery</p></div>
        <button className="gallery-add-btn" onClick={handleOpenAdd}>
          <i className="fas fa-plus" /><span>Add Image</span>
        </button>
      </div>

      <div className="gallery-stats">
        <div className="gallery-stat"><i className="fas fa-images gallery-stat-icon" /><div className="gallery-stat-info"><span className="gallery-stat-num">{images.length}</span><span className="gallery-stat-label">Total Images</span></div></div>
        <div className="gallery-stat"><i className="fas fa-layer-group gallery-stat-icon" /><div className="gallery-stat-info"><span className="gallery-stat-num">{[...new Set(images.map(i=>i.category))].length}</span><span className="gallery-stat-label">Categories</span></div></div>
        <div className="gallery-stat"><i className="fas fa-star gallery-stat-icon" /><div className="gallery-stat-info"><span className="gallery-stat-num">{images.filter(i=>i.category==="Events").length}</span><span className="gallery-stat-label">Events</span></div></div>
        <div className="gallery-stat"><i className="fas fa-filter gallery-stat-icon" /><div className="gallery-stat-info"><span className="gallery-stat-num">{filtered.length}</span><span className="gallery-stat-label">Showing</span></div></div>
      </div>

      <div className="gallery-tabs">
        {["All",...CATEGORIES].map((cat) => (
          <button key={cat} className={`gallery-tab ${activeCategory===cat?"active":""}`}
            onClick={() => { setActiveCategory(cat); setSearch(""); }}>
            <span>{cat}</span><span className="gallery-tab-count">{categoryCount(cat)}</span>
          </button>
        ))}
      </div>

      <div className="gallery-toolbar">
        <div className="gallery-search">
          <i className="fas fa-search" />
          <input type="text" placeholder="Search by caption…" value={search} onChange={(e)=>setSearch(e.target.value)} />
          {search && <button className="gallery-search-clear" onClick={()=>setSearch("")}>✕</button>}
        </div>
        {!loading && <p className="gallery-count"><strong>{filtered.length}</strong> image{filtered.length!==1?"s":""}</p>}
      </div>

      {/* ✅ ROLE NOTICE */}
      {!isSuperAdmin && (
        <div className="role-notice">
          <i className="fas fa-info-circle" />
          You can upload and edit images. Only Super Admin can delete.
        </div>
      )}

      {loading ? (
        <div className="gallery-skeletons">
          {[1,2,3,4,5,6].map((n)=>(
            <div key={n} className="gallery-skeleton-card">
              <div className="gsk gsk-img" /><div className="gsk-body"><div className="gsk gsk-title" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length===0 ? (
        <div className="gallery-empty">
          <i className="fas fa-image" /><h4>No Images Found</h4>
          <p>{search?`No results for "${search}"`:' Click "Add Image" to upload your first photo'}</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((item,idx)=>(
            <div className="gallery-card" key={item._id}>
              <div className="gc-image">
                <img src={item.image||item.imageUrl||item.url||"https://placehold.co/400x220/e8edff/2554f0?text=No+Image"} alt={item.caption} />
                <div className="gc-index">#{idx+1}</div>
                <span className="gc-category-badge">{item.category}</span>
                <div className="gc-overlay">
                  <button className="gc-btn-edit" onClick={()=>handleOpenEdit(item)}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  {/* ✅ Delete only for superadmin */}
                  {isSuperAdmin && (
                    <button className="gc-btn-delete" onClick={()=>handleDelete(item._id,item.caption)}>
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </div>
              </div>
              <div className="gc-body">
                <p className="gc-caption">{item.caption||"—"}</p>
                <div className="gc-footer">
                  <span className="gc-cat-tag">{item.category}</span>
                  <div className="gc-actions">
                    <button className="exam-btn-edit" onClick={()=>handleOpenEdit(item)}>
                      <i className="fas fa-edit" /> <span>Edit</span>
                    </button>
                    {/* ✅ Delete only for superadmin */}
                    {isSuperAdmin && (
                      <button className="exam-btn-delete" onClick={()=>handleDelete(item._id,item.caption)}>
                        <i className="fas fa-trash" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GalleryForm
        show={showModal} onClose={()=>setShowModal(false)} onSubmit={handleSubmit}
        isEdit={isEdit} loading={loadingAction} formData={formData} setFormData={setFormData}
        preview={preview}
        onImageChange={(e)=>{ const f=e.target.files[0]; if(f){setImage(f);setPreview(URL.createObjectURL(f));} }}
      />
    </div>
  );
}