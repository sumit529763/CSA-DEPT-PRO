import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import PlacementForm from "./PlacementForm";
import "./ManagePlacements.css";

const API = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

const EMPTY = {
  studentName: "", company: "", role: "", package: "",
  batch: "", type: "Full-Time", testimonial: "",
  isFeatured: false, photo: null, companyLogo: null,
};

const formatBatch = (b) => b || "—";

export default function ManagePlacements() {
  const { isSuperAdmin } = useAuth();

  const [items, setItems]                 = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [isEditMode, setIsEditMode]       = useState(false);
  const [search, setSearch]               = useState("");
  const [filterBatch, setFilterBatch]     = useState("All");
  const [filterType, setFilterType]       = useState("All");
  const [batches, setBatches]             = useState([]);

  const [formData, setFormData]           = useState(EMPTY);
  const [photoPreview, setPhotoPreview]   = useState(null);
  const [logoPreview, setLogoPreview]     = useState(null);

  // ── Fetch ────────────────────────────────────────
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(`${API}/api/placements`);
      const data = res.data.data || [];
      setItems(data);
      const uniqueBatches = [...new Set(data.map(p => p.batch))].sort().reverse();
      setBatches(uniqueBatches);
    } catch {
      toast.error("Failed to fetch placements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // ── Filter ───────────────────────────────────────
  useEffect(() => {
    let temp = [...items];
    if (filterBatch !== "All") temp = temp.filter(i => i.batch === filterBatch);
    if (filterType  !== "All") temp = temp.filter(i => i.type  === filterType);
    if (search) temp = temp.filter(i =>
      i.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      i.company?.toLowerCase().includes(search.toLowerCase()) ||
      i.role?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(temp);
  }, [items, filterBatch, filterType, search]);

  // ── Submit ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k !== "photo" && k !== "companyLogo") {
        if (v !== null && v !== undefined) data.append(k, v);
      }
    });
    if (formData.photo      instanceof File) data.append("photo",       formData.photo);
    if (formData.companyLogo instanceof File) data.append("companyLogo", formData.companyLogo);
    try {
      setLoadingAction(true);
      const config = { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } };
      if (isEditMode) await axios.put(`${API}/api/placements/${formData.id}`, data, config);
      else            await axios.post(`${API}/api/placements`, data, config);
      toast.success(isEditMode ? "Placement updated!" : "Placement added!");
      setShowModal(false); fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save.");
    } finally { setLoadingAction(false); }
  };

  // ── Open modals ──────────────────────────────────
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(EMPTY);
    setPhotoPreview(null); setLogoPreview(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setFormData({
      studentName: item.studentName || "", company:     item.company     || "",
      role:        item.role        || "", package:     item.package     || "",
      batch:       item.batch       || "", type:        item.type        || "Full-Time",
      testimonial: item.testimonial || "", isFeatured:  item.isFeatured  || false,
      photo: null, companyLogo: null, id: item._id,
    });
    setPhotoPreview(item.photo       || null);
    setLogoPreview(item.companyLogo  || null);
    setShowModal(true);
  };

  // ── Delete ───────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/placements/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Placement deleted"); fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ── Toggle featured ──────────────────────────────
  const toggleFeatured = async (item) => {
    try {
      await axios.put(
        `${API}/api/placements/${item._id}`,
        { isFeatured: !item.isFeatured },
        { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" } }
      );
      toast.success(`${item.studentName} ${!item.isFeatured ? "featured" : "unfeatured"}`);
      fetchItems();
    } catch { toast.error("Toggle failed"); }
  };

  // ── Stats ────────────────────────────────────────
  const featuredCount   = items.filter(i => i.isFeatured).length;
  const fullTimeCount   = items.filter(i => i.type === "Full-Time").length;
  const internCount     = items.filter(i => i.type === "Internship").length;
  const batchCount      = (b) => b === "All" ? items.length : items.filter(i => i.batch === b).length;

  return (
    <div className="mp-page">

      {/* ── Header ── */}
      <div className="mp-header">
        <div>
          <h2>Manage Placements</h2>
          <p>Add and manage student placement records &amp; success stories</p>
        </div>
        <button className="mp-add-btn" onClick={openAddModal}>
          <i className="fas fa-plus" /><span>Add Placement</span>
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="mp-stats">
        <div className="mp-stat">
          <i className="fas fa-users mp-stat-icon" />
          <div className="mp-stat-info"><span className="mp-stat-num">{items.length}</span><span className="mp-stat-label">Total Placed</span></div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-star mp-stat-icon" />
          <div className="mp-stat-info"><span className="mp-stat-num">{featuredCount}</span><span className="mp-stat-label">Featured</span></div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-briefcase mp-stat-icon" />
          <div className="mp-stat-info"><span className="mp-stat-num">{fullTimeCount}</span><span className="mp-stat-label">Full-Time</span></div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-laptop-code mp-stat-icon" />
          <div className="mp-stat-info"><span className="mp-stat-num">{internCount}</span><span className="mp-stat-label">Internships</span></div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-filter mp-stat-icon" />
          <div className="mp-stat-info"><span className="mp-stat-num">{filtered.length}</span><span className="mp-stat-label">Showing</span></div>
        </div>
      </div>

      {/* ── Batch Tabs ── */}
      <div className="mp-tabs">
        {["All", ...batches].map(b => (
          <button
            key={b}
            className={`mp-tab ${filterBatch === b ? "active" : ""}`}
            onClick={() => { setFilterBatch(b); setSearch(""); }}
          >
            <span>{b === "All" ? "All Batches" : `Batch ${b}`}</span>
            <span className="mp-tab-count">{batchCount(b)}</span>
          </button>
        ))}
        <div className="mp-tab-type-group">
          {["All", "Full-Time", "Internship"].map(t => (
            <button
              key={t}
              className={`mp-type-pill ${filterType === t ? "active" : ""}`}
              onClick={() => setFilterType(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="mp-toolbar">
        <div className="mp-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by name, company or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="mp-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        {!loading && (
          <p className="mp-count"><strong>{filtered.length}</strong> record{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* ── Role notice ── */}
      {!isSuperAdmin && (
        <div className="mp-role-notice">
          <i className="fas fa-info-circle" />
          You can create and edit placements. Only Super Admin can delete.
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="mp-skeletons">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="mp-skeleton-card">
              <div className="mpsk mpsk-img" />
              <div className="mpsk-body">
                <div className="mpsk mpsk-title" />
                <div className="mpsk mpsk-line" />
                <div className="mpsk mpsk-line mpsk-short" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mp-empty">
          <i className="fas fa-briefcase" />
          <h4>No Placements Found</h4>
          <p>{search ? `No results for "${search}"` : 'Click "Add Placement" to add your first record'}</p>
        </div>
      ) : (
        <div className="mp-grid">
          {filtered.map((item, idx) => (
            <div className={`mp-card ${item.isFeatured ? "featured" : ""}`} key={item._id}>

              {/* Image area */}
              <div className="mp-card-img">
                <div className="mp-card-photo">
                  {item.photo
                    ? <img src={item.photo} alt={item.studentName} />
                    : <span>{item.studentName?.charAt(0)}</span>
                  }
                </div>
                <div className="mp-card-idx">#{idx + 1}</div>
                {item.isFeatured && <div className="mp-feat-ribbon">⭐ Featured</div>}
                <span className={`mp-type-badge ${item.type === "Internship" ? "intern" : ""}`}>
                  {item.type}
                </span>
                <div className="mp-card-overlay">
                  <button className="mp-ov-edit" onClick={() => openEditModal(item)}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button className="mp-ov-del" onClick={() => handleDelete(item._id, item.studentName)}>
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="mp-card-body">
                <p className="mp-card-name">{item.studentName}</p>

                <div className="mp-card-meta">
                  {item.company && (
                    <span className="mp-meta-item">
                      {item.companyLogo
                        ? <img src={item.companyLogo} alt={item.company} className="mp-co-logo" />
                        : <span className="mp-co-dot">{item.company.charAt(0)}</span>
                      }
                      {item.company}
                    </span>
                  )}
                  {item.role && (
                    <span className="mp-meta-item">
                      <i className="fas fa-user-tie" /> {item.role}
                    </span>
                  )}
                  {item.batch && (
                    <span className="mp-meta-item">
                      <i className="fas fa-calendar-alt" /> Batch {item.batch}
                    </span>
                  )}
                </div>

                <div className="mp-card-footer">
                  <span className="mp-pkg-tag">💰 {item.package}</span>
                  <div className="mp-card-actions">
                    <button
                      className={`mp-feat-btn ${item.isFeatured ? "on" : ""}`}
                      onClick={() => toggleFeatured(item)}
                    >
                      {item.isFeatured ? "★" : "☆"}
                    </button>
                    <button className="exam-btn-edit" onClick={() => openEditModal(item)}>
                      <i className="fas fa-edit" /><span>Edit</span>
                    </button>
                    {isSuperAdmin && (
                      <button className="exam-btn-delete" onClick={() => handleDelete(item._id, item.studentName)}>
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

      {/* ── Form Modal ── */}
      <PlacementForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
        loading={loadingAction}
        formData={formData}
        setFormData={setFormData}
        photoPreview={photoPreview}
        logoPreview={logoPreview}
        onPhotoChange={(e) => {
          const f = e.target.files[0];
          if (f) { setFormData(p => ({ ...p, photo: f })); setPhotoPreview(URL.createObjectURL(f)); }
        }}
        onLogoChange={(e) => {
          const f = e.target.files[0];
          if (f) { setFormData(p => ({ ...p, companyLogo: f })); setLogoPreview(URL.createObjectURL(f)); }
        }}
      />

    </div>
  );
}