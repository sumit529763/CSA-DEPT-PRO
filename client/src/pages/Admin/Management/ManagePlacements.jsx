import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import "./ManagePlacements.css";

const API = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

const EMPTY = {
  studentName: "",
  company: "",
  role: "",
  package: "",
  batch: "",
  type: "Full-Time",
  testimonial: "",
  isFeatured: false,
  photo: null,
  companyLogo: null,
};

export default function ManagePlacements() {
  const { isSuperAdmin } = useAuth();

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [batches, setBatches] = useState([]);

  // ── Fetch ─────────────────────────────────────────
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/placements`);
      const data = res.data.data || [];
      setItems(data);
      const uniqueBatches = [...new Set(data.map((p) => p.batch))]
        .sort()
        .reverse();
      setBatches(uniqueBatches);
    } catch {
      toast.error("Failed to fetch placements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ── Filter logic ──────────────────────────────────
  useEffect(() => {
    let temp = [...items];
    if (filterBatch !== "All") temp = temp.filter((i) => i.batch === filterBatch);
    if (filterType !== "All") temp = temp.filter((i) => i.type === filterType);
    if (search)
      temp = temp.filter(
        (i) =>
          i.studentName?.toLowerCase().includes(search.toLowerCase()) ||
          i.company?.toLowerCase().includes(search.toLowerCase()) ||
          i.role?.toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(temp);
  }, [items, filterBatch, filterType, search]);

  // ── Form handlers ─────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setForm((p) => ({ ...p, [name]: file }));
        if (name === "photo") setPhotoPreview(URL.createObjectURL(file));
        if (name === "companyLogo") setLogoPreview(URL.createObjectURL(file));
      }
    } else if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditItem(null);
    setPhotoPreview(null);
    setLogoPreview(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY);
    setPhotoPreview(null);
    setLogoPreview(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      studentName: item.studentName || "",
      company: item.company || "",
      role: item.role || "",
      package: item.package || "",
      batch: item.batch || "",
      type: item.type || "Full-Time",
      testimonial: item.testimonial || "",
      isFeatured: item.isFeatured || false,
      photo: null, // Reset so we don't send the old URL as a file
      companyLogo: null,
    });
    setPhotoPreview(item.photo || null);
    setLogoPreview(item.companyLogo || null);
    setShowForm(true);
  };

  // ── Submit ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // 1. Append text/boolean fields
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "photo" && k !== "companyLogo") {
        if (v !== null && v !== undefined) {
          data.append(k, v);
        }
      }
    });

    // 2. ONLY append files if they are actual File objects (newly selected)
    if (form.photo instanceof File) {
      data.append("photo", form.photo);
    }
    if (form.companyLogo instanceof File) {
      data.append("companyLogo", form.companyLogo);
    }

    try {
      setLoadingAction(true);
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editItem) {
        await axios.put(`${API}/api/placements/${editItem._id}`, data, config);
        toast.success("Placement updated!");
      } else {
        await axios.post(`${API}/api/placements`, data, config);
        toast.success("Placement added!");
      }
      resetForm();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoadingAction(false);
    }
  };

  // ── Delete (superadmin only) ──────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/placements/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Placement deleted");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ── Toggle featured ───────────────────────────────
  const toggleFeatured = async (item) => {
    try {
      // Send as JSON for simple toggle to avoid file upload errors
      await axios.put(
        `${API}/api/placements/${item._id}`,
        { isFeatured: !item.isFeatured },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(
        `${item.studentName} ${!item.isFeatured ? "featured" : "unfeatured"}`
      );
      fetchItems();
    } catch {
      toast.error("Toggle failed");
    }
  };

  // ── Stats ─────────────────────────────────────────
  const totalFeatured = items.filter((i) => i.isFeatured).length;
  const totalFullTime = items.filter((i) => i.type === "Full-Time").length;
  const totalInternship = items.filter((i) => i.type === "Internship").length;

  return (
    <div className="mp-page">
      {/* ── Header ── */}
      <div className="mp-header">
        <div>
          <h2>Manage Placements</h2>
          <p>Add and manage student placement records &amp; success stories</p>
        </div>
        <button className="mp-add-btn" onClick={openAdd}>
          <i className="fas fa-plus" /> <span>Add Placement</span>
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="mp-stats">
        <div className="mp-stat">
          <i className="fas fa-users mp-stat-icon" />
          <div className="mp-stat-info">
            <span className="mp-stat-num">{items.length}</span>
            <span className="mp-stat-label">Total</span>
          </div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-star mp-stat-icon" />
          <div className="mp-stat-info">
            <span className="mp-stat-num">{totalFeatured}</span>
            <span className="mp-stat-label">Featured</span>
          </div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-briefcase mp-stat-icon" />
          <div className="mp-stat-info">
            <span className="mp-stat-num">{totalFullTime}</span>
            <span className="mp-stat-label">Full-Time</span>
          </div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-laptop-code mp-stat-icon" />
          <div className="mp-stat-info">
            <span className="mp-stat-num">{totalInternship}</span>
            <span className="mp-stat-label">Internship</span>
          </div>
        </div>
        <div className="mp-stat">
          <i className="fas fa-filter mp-stat-icon" />
          <div className="mp-stat-info">
            <span className="mp-stat-num">{filtered.length}</span>
            <span className="mp-stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="mp-filters-bar">
        <div className="mp-filter-group">
          <span className="mp-filter-label">Batch</span>
          <div className="mp-pills">
            {["All", ...batches].map((b) => (
              <button
                key={b}
                className={`mp-pill ${filterBatch === b ? "active" : ""}`}
                onClick={() => setFilterBatch(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="mp-filter-group">
          <span className="mp-filter-label">Type</span>
          <div className="mp-pills">
            {["All", "Full-Time", "Internship"].map((t) => (
              <button
                key={t}
                className={`mp-pill ${filterType === t ? "active" : ""}`}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="mp-toolbar">
        <div className="mp-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by name, company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="mp-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        {!loading && (
          <p className="mp-count">
            <strong>{filtered.length}</strong> record
            {filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="mp-role-notice">
          <i className="fas fa-info-circle" />
          You can create and edit placements. Only Super Admin can delete.
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="mp-skeletons">
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
          <p>
            {search
              ? `No results for "${search}"`
              : 'Click "Add Placement" to add your first record'}
          </p>
        </div>
      ) : (
        <div className="mp-grid">
          {filtered.map((item, idx) => (
            <div
              className={`mp-card ${item.isFeatured ? "featured" : ""}`}
              key={item._id}
            >
              {item.isFeatured && <div className="mp-feat-ribbon">⭐ Featured</div>}
              <div className="mp-card-img">
                <div className="mp-card-photo">
                  {item.photo ? (
                    <img src={item.photo} alt={item.studentName} />
                  ) : (
                    <span>{item.studentName?.charAt(0)}</span>
                  )}
                </div>
                <div className="mp-card-idx">#{idx + 1}</div>
                <span
                  className={`mp-card-type-badge ${
                    item.type === "Internship" ? "intern" : ""
                  }`}
                >
                  {item.type}
                </span>

                <div className="mp-card-overlay">
                  <button className="mp-ov-btn" onClick={() => openEdit(item)}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button
                      className="mp-ov-btn mp-ov-del"
                      onClick={() => handleDelete(item._id, item.studentName)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mp-card-body">
                <h4 className="mp-card-name">{item.studentName}</h4>
                <p className="mp-card-role">{item.role}</p>

                <div className="mp-card-company-row">
                  {item.companyLogo ? (
                    <img
                      src={item.companyLogo}
                      alt={item.company}
                      className="mp-co-logo"
                    />
                  ) : (
                    <div className="mp-co-initial">{item.company?.charAt(0)}</div>
                  )}
                  <span className="mp-card-company">{item.company}</span>
                </div>

                <div className="mp-card-meta">
                  <span className="mp-pkg">💰 {item.package}</span>
                  <span className="mp-batch">Batch {item.batch}</span>
                </div>

                <div className="mp-card-footer">
                  <button
                    className={`mp-feat-btn ${item.isFeatured ? "on" : ""}`}
                    onClick={() => toggleFeatured(item)}
                    title={item.isFeatured ? "Unfeature" : "Mark as Featured"}
                  >
                    {item.isFeatured ? "★ Unfeature" : "☆ Feature"}
                  </button>
                  <div className="mp-footer-actions">
                    <button className="mp-edit-btn" onClick={() => openEdit(item)}>
                      <i className="fas fa-edit" /> <span>Edit</span>
                    </button>
                    {isSuperAdmin && (
                      <button
                        className="mp-del-btn"
                        onClick={() => handleDelete(item._id, item.studentName)}
                      >
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
      {showForm && (
        <div className="mp-overlay" onClick={resetForm}>
          <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-head">
              <h3>{editItem ? "Edit Placement" : "Add New Placement"}</h3>
              <button className="mp-close" onClick={resetForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mp-upload-row">
                <div className="mp-upload-box">
                  <div className="mp-upload-preview mp-upload-round">
                    {photoPreview ? (
                      <img src={photoPreview} alt="student" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <label className="mp-upload-label">
                    Student Photo
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      hidden
                    />
                  </label>
                </div>
                <div className="mp-upload-box">
                  <div className="mp-upload-preview mp-upload-square">
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo" />
                    ) : (
                      <span>🏢</span>
                    )}
                  </div>
                  <label className="mp-upload-label">
                    Company Logo
                    <input
                      type="file"
                      name="companyLogo"
                      accept="image/*"
                      onChange={handleChange}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <label className="mp-featured-toggle">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                <span>Mark as Featured Placement</span>
              </label>

              <div className="mp-form-grid">
                <div className="mp-fg">
                  <label>Student Name *</label>
                  <input
                    name="studentName"
                    value={form.studentName}
                    placeholder="Rahul Kumar"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mp-fg">
                  <label>Company *</label>
                  <input
                    name="company"
                    value={form.company}
                    placeholder="Google"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mp-fg">
                  <label>Role / Position *</label>
                  <input
                    name="role"
                    value={form.role}
                    placeholder="Software Engineer"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mp-fg">
                  <label>Package *</label>
                  <input
                    name="package"
                    value={form.package}
                    placeholder="12 LPA"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mp-fg">
                  <label>Batch Year *</label>
                  <input
                    name="batch"
                    value={form.batch}
                    placeholder="2024"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mp-fg">
                  <label>Type *</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="mp-fg mp-full">
                  <label>Testimonial / Quote</label>
                  <textarea
                    name="testimonial"
                    value={form.testimonial}
                    placeholder="Student's experience in their own words..."
                    rows={3}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mp-modal-actions">
                <button
                  type="button"
                  className="mp-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mp-submit"
                  disabled={loadingAction}
                >
                  {loadingAction
                    ? editItem
                      ? "Saving…"
                      : "Adding…"
                    : editItem
                    ? "Save Changes"
                    : "Add Placement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}