import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import "./ManageAchievements.css";

const API      = `${import.meta.env.VITE_API_BASE_URL}/api/achievements`;
const getToken = () => localStorage.getItem("token");

const CATEGORIES = ["Academic","Research","Sports","Cultural","Technical","Award","Other"];

const CAT_META = {
  Academic:  { icon: "fa-graduation-cap", emoji: "🎓" },
  Research:  { icon: "fa-flask",          emoji: "🔬" },
  Sports:    { icon: "fa-trophy",         emoji: "🏆" },
  Cultural:  { icon: "fa-music",          emoji: "🎭" },
  Technical: { icon: "fa-code",           emoji: "💻" },
  Award:     { icon: "fa-award",          emoji: "🏅" },
  Other:     { icon: "fa-star",           emoji: "⭐" },
};

const EMPTY = {
  id: null, title: "", description: "", studentName: "",
  category: "Academic", year: new Date().getFullYear().toString(),
  isHighlight: false,
};

export default function ManageAchievements() {
  const { isSuperAdmin } = useAuth();

  const [records, setRecords]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [form, setForm]           = useState(EMPTY);
  const [image, setImage]         = useState(null);
  const [preview, setPreview]     = useState("");
  const fileRef                   = useRef();

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

  useEffect(() => {
    let temp = [...records];
    if (filterCat !== "All") temp = temp.filter(r => r.category === filterCat);
    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.studentName || "").toLowerCase().includes(q)
      );
    }
    setFiltered(temp);
  }, [records, filterCat, search]);

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
    setForm({
      id: r._id, title: r.title, description: r.description,
      studentName: r.studentName || "", category: r.category,
      year: r.year, isHighlight: r.isHighlight || false,
    });
    setPreview(r.image || ""); setImage(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (k !== "id") fd.append(k, v); });
    if (image) fd.append("image", image);
    const cfg = {
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" },
    };
    try {
      setSaving(true);
      if (isEdit) await axios.put(`${API}/${form.id}`, fd, cfg);
      else        await axios.post(API, fd, cfg);
      toast.success(isEdit ? "Achievement updated!" : "Achievement added!");
      setShowModal(false); fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Achievement deleted"); fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  const catCount = (c) => c === "All"
    ? records.length
    : records.filter(r => r.category === c).length;

  const highlightCount = records.filter(r => r.isHighlight).length;

  return (
    <div className="ach-page">

      {/* ── Header ── */}
      <div className="ach-header">
        <div>
          <h2>Manage Achievements</h2>
          <p>Add student &amp; department achievements shown on the public page</p>
        </div>
        <button className="ach-add-btn" onClick={openAdd}>
          <i className="fas fa-plus" /><span>Add Achievement</span>
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="ach-stats">
        <div className="ach-stat">
          <i className="fas fa-trophy ach-stat-icon" />
          <div className="ach-stat-info">
            <span className="ach-stat-num">{records.length}</span>
            <span className="ach-stat-label">Total</span>
          </div>
        </div>
        <div className="ach-stat">
          <i className="fas fa-star ach-stat-icon" />
          <div className="ach-stat-info">
            <span className="ach-stat-num">{highlightCount}</span>
            <span className="ach-stat-label">Highlights</span>
          </div>
        </div>
        <div className="ach-stat">
          <i className="fas fa-layer-group ach-stat-icon" />
          <div className="ach-stat-info">
            <span className="ach-stat-num">{CATEGORIES.length}</span>
            <span className="ach-stat-label">Categories</span>
          </div>
        </div>
        <div className="ach-stat">
          <i className="fas fa-filter ach-stat-icon" />
          <div className="ach-stat-info">
            <span className="ach-stat-num">{filtered.length}</span>
            <span className="ach-stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="ach-tabs">
        {["All", ...CATEGORIES].map(c => (
          <button
            key={c}
            className={`ach-tab ${filterCat === c ? "active" : ""}`}
            onClick={() => { setFilterCat(c); setSearch(""); }}
          >
            {c !== "All" && <span>{CAT_META[c].emoji}</span>}
            <span>{c}</span>
            <span className="ach-tab-count">{catCount(c)}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="ach-toolbar">
        <div className="ach-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by title or student name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ach-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        {!loading && (
          <p className="ach-count">
            <strong>{filtered.length}</strong> record{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Role notice ── */}
      {!isSuperAdmin && (
        <div className="ach-role-notice">
          <i className="fas fa-info-circle" />
          You can create and edit achievements. Only Super Admin can delete.
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="ach-skeletons">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="ach-skeleton-card">
              <div className="achsk achsk-img" />
              <div className="achsk-body">
                <div className="achsk achsk-title" />
                <div className="achsk achsk-line" />
                <div className="achsk achsk-line achsk-short" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ach-empty">
          <i className="fas fa-trophy" />
          <h4>No Achievements Found</h4>
          <p>{search ? `No results for "${search}"` : 'Click "Add Achievement" to add your first record'}</p>
        </div>
      ) : (
        <div className="ach-grid">
          {filtered.map((r, idx) => (
            <div className={`ach-card ${r.isHighlight ? "highlight" : ""}`} key={r._id}>

              {/* Image area */}
              <div className="ach-card-img">
                {r.image ? (
                  <img src={r.image} alt={r.title} />
                ) : (
                  <div className="ach-card-icon">
                    <span>{CAT_META[r.category]?.emoji || "⭐"}</span>
                  </div>
                )}
                <div className="ach-card-idx">#{idx + 1}</div>
                {r.isHighlight && <div className="ach-hl-ribbon">★ Highlight</div>}
                <span className={`ach-cat-badge ach-cat-${r.category.toLowerCase()}`}>
                  {r.category}
                </span>

                {/* Overlay */}
                <div className="ach-card-overlay">
                  <button className="ach-ov-edit" onClick={() => openEdit(r)}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button className="ach-ov-del" onClick={() => handleDelete(r._id, r.title)}>
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="ach-card-body">
                <p className="ach-card-title">{r.title}</p>
                <div className="ach-card-meta">
                  {r.studentName && (
                    <span className="ach-meta-item">
                      <i className="fas fa-user" /> {r.studentName}
                    </span>
                  )}
                  <span className="ach-meta-item">
                    <i className="fas fa-calendar-alt" /> {r.year}
                  </span>
                </div>
                {r.description && (
                  <p className="ach-card-desc">{r.description}</p>
                )}

                {/* Footer */}
                <div className="ach-card-footer">
                  <span className="ach-year-tag">{r.year}</span>
                  <div className="ach-card-actions">
                    <button className="exam-btn-edit" onClick={() => openEdit(r)}>
                      <i className="fas fa-edit" /><span>Edit</span>
                    </button>
                    {isSuperAdmin && (
                      <button className="exam-btn-delete" onClick={() => handleDelete(r._id, r.title)}>
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

      {/* ── Modal ── */}
      {showModal && (
        <div className="ach-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="ach-modal">

            <div className="ach-modal-header">
              <div className="ach-modal-header-left">
                <div className="ach-modal-icon">🏆</div>
                <div>
                  <h3>{isEdit ? "Update Achievement" : "Add Achievement"}</h3>
                  <p className="ach-modal-sub">Record a student or department achievement</p>
                </div>
              </div>
              <button
                type="button" className="ach-modal-close"
                onClick={() => setShowModal(false)} aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form
              className="ach-modal-form"
              onSubmit={e => { e.preventDefault(); handleSubmit(e); }}
            >
              <div className="ach-modal-body">

                {/* Title */}
                <div className="ach-field">
                  <label className="ach-label">
                    Title <span className="ach-req">*</span>
                  </label>
                  <input
                    autoFocus className="ach-input"
                    name="title" value={form.title}
                    onChange={handleChange} required
                    placeholder="e.g. 1st Prize — State Level Hackathon"
                  />
                </div>

                {/* Category selector */}
                <div className="ach-field">
                  <label className="ach-label">
                    Category <span className="ach-req">*</span>
                  </label>
                  <div className="ach-cat-grid">
                    {CATEGORIES.map(c => (
                      <button
                        key={c} type="button"
                        className={`ach-cat-btn ${form.category === c ? "active" : ""}`}
                        onClick={() => setForm(p => ({ ...p, category: c }))}
                      >
                        <span>{CAT_META[c].emoji}</span>
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row: student + year */}
                <div className="ach-row">
                  <div className="ach-field">
                    <label className="ach-label">Student / Team Name</label>
                    <input
                      className="ach-input"
                      name="studentName" value={form.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Ananya Dash or leave blank"
                    />
                  </div>
                  <div className="ach-field">
                    <label className="ach-label">
                      Year <span className="ach-req">*</span>
                    </label>
                    <input
                      className="ach-input"
                      name="year" value={form.year}
                      onChange={handleChange} required
                      placeholder="e.g. 2024"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="ach-field">
                  <label className="ach-label">
                    Description <span className="ach-req">*</span>
                  </label>
                  <textarea
                    className="ach-input ach-textarea" rows={3}
                    name="description" value={form.description}
                    onChange={handleChange} required
                    placeholder="Describe the achievement in detail…"
                  />
                </div>

                {/* Image upload */}
                <div className="ach-field">
                  <label className="ach-label">
                    Image / Certificate
                    <span className="ach-optional"> (optional)</span>
                  </label>
                  <div className="ach-upload" onClick={() => fileRef.current.click()}>
                    {preview ? (
                      <div className="ach-preview-wrap">
                        <img src={preview} alt="preview" className="ach-preview-img" />
                        <div className="ach-preview-overlay"><span>🔄 Change Image</span></div>
                      </div>
                    ) : (
                      <div className="ach-upload-empty">
                        <span className="ach-upload-icon">🖼️</span>
                        <span>Tap to upload image or certificate</span>
                        <span className="ach-upload-hint">JPG, PNG, WebP · Max 5MB</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef} type="file" accept="image/*" hidden
                    onChange={e => {
                      const f = e.target.files[0];
                      if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
                    }}
                  />
                </div>

                {/* Highlight toggle */}
                <label className="ach-highlight-toggle">
                  <input
                    type="checkbox" name="isHighlight"
                    checked={form.isHighlight} onChange={handleChange}
                  />
                  <div>
                    <span>★ Mark as Highlight</span>
                    <span className="ach-toggle-sub">Featured prominently on the public page</span>
                  </div>
                </label>

              </div>

              <div className="ach-modal-footer">
                <button
                  type="button" className="ach-btn ach-btn--cancel"
                  onClick={() => setShowModal(false)}
                >Cancel</button>
                <button
                  type="submit" className="ach-btn ach-btn--submit"
                  disabled={saving}
                >
                  {saving ? <span className="ach-spinner" /> : null}
                  {saving ? "Saving…" : isEdit ? "Update Achievement" : "🏆 Add Achievement"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}