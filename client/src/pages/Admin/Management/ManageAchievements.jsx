import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Styles/Management.css";
import "./ManageAchievements.css";

const API      = `${import.meta.env.VITE_API_BASE_URL}/api/achievements`;
const getToken = () => localStorage.getItem("token");

const CATEGORIES = ["Academic", "Research", "Sports", "Cultural", "Technical", "Award", "Other"];

const EMPTY = {
  id: null, title: "", description: "", studentName: "",
  category: "Academic", year: new Date().getFullYear().toString(),
  isHighlight: false,
};

export default function ManageAchievements() {
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [form, setForm]           = useState(EMPTY);
  const [image, setImage]         = useState(null);
  const [preview, setPreview]     = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRecords(res.data.data || []);
    } catch { toast.error("Failed to load achievements"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setIsEdit(false); setForm(EMPTY);
    setImage(null); setPreview(""); setShowModal(true);
  };

  const openEdit = (r) => {
    setIsEdit(true);
    setForm({ id: r._id, title: r.title, description: r.description,
      studentName: r.studentName || "", category: r.category,
      year: r.year, isHighlight: r.isHighlight || false });
    setPreview(r.image || ""); setImage(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (k !== "id") fd.append(k, v); });
    if (image) fd.append("image", image);
    const cfg = { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } };
    try {
      setSaving(true);
      if (isEdit) await axios.put(`${API}/${form.id}`, fd, cfg);
      else        await axios.post(API, fd, cfg);
      toast.success(isEdit ? "Updated!" : "Achievement added!");
      setShowModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success("Deleted"); fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = records.filter(r => {
    const catMatch = filterCat === "all" || r.category === filterCat;
    const q = search.toLowerCase();
    const searchMatch = !search || r.title.toLowerCase().includes(q) || (r.studentName || "").toLowerCase().includes(q);
    return catMatch && searchMatch;
  });

  const catIcons = {
    Academic: "fa-graduation-cap", Research: "fa-flask", Sports: "fa-trophy",
    Cultural: "fa-music", Technical: "fa-code", Award: "fa-award", Other: "fa-star",
  };

  return (
    <div className="management-view">
      <div className="management-header">
        <div>
          <h2 className="management-title">Manage Achievements</h2>
          <p className="management-sub">Add student &amp; department achievements shown on the public achievements page.</p>
        </div>
        <button className="btn-add" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Achievement
        </button>
      </div>

      {/* Filters */}
      <div className="ach-filters">
        <input
          type="text" className="search-input" placeholder="Search by title or student..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div className="ach-cat-tabs">
          <button className={`ach-cat-tab ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} className={`ach-cat-tab ${filterCat === c ? "active" : ""}`} onClick={() => setFilterCat(c)}>
              <i className={`fas ${catIcons[c]}`}></i> {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="loading-text">Loading...</p> : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th><th>Title</th><th>Student</th><th>Category</th>
                <th>Year</th><th>Highlight</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign:"center", padding:"30px", color:"#94a3b8" }}>No records found.</td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    {r.image
                      ? <img src={r.image} alt={r.title} className="ach-thumb" />
                      : <div className="ach-thumb-icon"><i className={`fas ${catIcons[r.category] || "fa-star"}`}></i></div>
                    }
                  </td>
                  <td className="td-bold" style={{ maxWidth:"200px" }}>{r.title}</td>
                  <td>{r.studentName || <span style={{ color:"#94a3b8" }}>—</span>}</td>
                  <td><span className={`cat-badge cat-${r.category.toLowerCase()}`}>{r.category}</span></td>
                  <td><span className="year-badge">{r.year}</span></td>
                  <td>{r.isHighlight ? <span className="hl-yes">★ Yes</span> : <span className="hl-no">No</span>}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(r)} title="Edit"><i className="fas fa-edit"></i></button>
                      <button className="btn-delete" onClick={() => handleDelete(r._id, r.title)} title="Delete"><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box ach-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEdit ? "Edit Achievement" : "Add Achievement"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="ach-form">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. 1st Prize — State Level Hackathon" />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input name="year" value={form.year} onChange={handleChange} required placeholder="e.g. 2024" />
                </div>
              </div>

              <div className="form-group">
                <label>Student / Team Name</label>
                <input name="studentName" value={form.studentName} onChange={handleChange} placeholder="e.g. Ananya Dash & Team or leave blank for department award" />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the achievement in detail..." />
              </div>

              <div className="form-group">
                <label>Image / Certificate Photo <span style={{ fontWeight:400, color:"#94a3b8" }}>(optional)</span></label>
                <input type="file" accept="image/*" onChange={e => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} />
                {preview && <img src={preview} alt="preview" className="ach-img-preview" />}
              </div>

              <div className="form-group form-group-check">
                <input type="checkbox" id="achHL" name="isHighlight" checked={form.isHighlight} onChange={handleChange} />
                <label htmlFor="achHL">★ Mark as Highlight (featured prominently)</label>
              </div>

              <div className="ach-modal-footer">
                <button type="button" className="btn-cancel-ach" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save-ach" disabled={saving}>{saving ? "Saving..." : isEdit ? "Update" : "Add Achievement"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}