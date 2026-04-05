import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageAlumni.css";

const API      = `${import.meta.env.VITE_API_BASE_URL}/api/alumni`;
const getToken = () => localStorage.getItem("token");

const EMPTY = {
  id: null,
  name: "",
  batch: "",
  passoutYear: "",
  position: "",
  company: "",
  location: "",
  linkedinUrl: "",
  quote: "",
  isHighlight: false,
};

export default function ManageAlumni() {
  const [records, setRecords]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [isEdit, setIsEdit]         = useState(false);
  const [saving, setSaving]         = useState(false);
  const [search, setSearch]         = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [years, setYears]           = useState([]);
  const [form, setForm]             = useState(EMPTY);
  const [photo, setPhoto]           = useState(null);
  const [preview, setPreview]       = useState("");
  const fileRef                     = useRef();

  /* ── fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(`${API}/admin/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = res.data.data || [];
      setRecords(data);
      const yr = [...new Set(data.map(r => r.passoutYear))].sort((a, b) => b.localeCompare(a));
      setYears(yr);
    } catch { toast.error("Failed to load alumni"); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── filter ── */
  useEffect(() => {
    let temp = [...records];
    if (filterYear !== "All") temp = temp.filter(r => r.passoutYear === filterYear);
    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.company  || "").toLowerCase().includes(q) ||
        (r.position || "").toLowerCase().includes(q)
      );
    }
    setFiltered(temp);
  }, [records, filterYear, search]);

  /* ── handlers ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setIsEdit(false); setForm(EMPTY);
    setPhoto(null); setPreview(""); setShowModal(true);
  };

  const openEdit = (r) => {
    setIsEdit(true);
    setForm({
      id: r._id, name: r.name, batch: r.batch,
      passoutYear: r.passoutYear, position: r.position || "",
      company: r.company || "", location: r.location || "",
      linkedinUrl: r.linkedinUrl || "", quote: r.quote || "",
      isHighlight: r.isHighlight || false,
    });
    setPreview(r.photo || ""); setPhoto(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd  = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (k !== "id") fd.append(k, v); });
    if (photo) fd.append("photo", photo);
    const cfg = { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } };
    try {
      setSaving(true);
      if (isEdit) await axios.put(`${API}/${form.id}`, fd, cfg);
      else        await axios.post(API, fd, cfg);
      toast.success(isEdit ? "Alumni updated!" : "Alumni added!");
      setShowModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
    finally       { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success("Alumni removed"); fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  /* ── derived stats ── */
  const highlightCount = records.filter(r => r.isHighlight).length;
  const yearCount = (y) => y === "All" ? records.length : records.filter(r => r.passoutYear === y).length;

  /* ── initials avatar ── */
  const initials = (name = "") =>
    name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  /* ══════════════════════════════════ RENDER ══════════════════════════════════ */
  return (
    <div className="al-page">

      {/* ── Header ── */}
      <div className="al-header">
        <div>
          <h2>Manage Alumni</h2>
          <p>Add and manage alumni profiles shown on the public Alumni page</p>
        </div>
        <button className="al-add-btn" onClick={openAdd}>
          <i className="fas fa-plus" /><span>Add Alumni</span>
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="al-stats">
        <div className="al-stat">
          <i className="fas fa-user-graduate al-stat-icon" />
          <div className="al-stat-info">
            <span className="al-stat-num">{records.length}</span>
            <span className="al-stat-label">Total Alumni</span>
          </div>
        </div>
        <div className="al-stat">
          <i className="fas fa-star al-stat-icon" />
          <div className="al-stat-info">
            <span className="al-stat-num">{highlightCount}</span>
            <span className="al-stat-label">Highlights</span>
          </div>
        </div>
        <div className="al-stat">
          <i className="fas fa-calendar-alt al-stat-icon" />
          <div className="al-stat-info">
            <span className="al-stat-num">{years.length}</span>
            <span className="al-stat-label">Batch Years</span>
          </div>
        </div>
        <div className="al-stat">
          <i className="fas fa-filter al-stat-icon" />
          <div className="al-stat-info">
            <span className="al-stat-num">{filtered.length}</span>
            <span className="al-stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* ── Year Tabs ── */}
      <div className="al-tabs">
        {["All", ...years].map(y => (
          <button
            key={y}
            className={`al-tab ${filterYear === y ? "active" : ""}`}
            onClick={() => { setFilterYear(y); setSearch(""); }}
          >
            <span>{y === "All" ? "All Years" : y}</span>
            <span className="al-tab-count">{yearCount(y)}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="al-toolbar">
        <div className="al-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by name, company or position…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="al-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        {!loading && (
          <p className="al-count">
            <strong>{filtered.length}</strong> record{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="al-skeletons">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="al-skeleton-card">
              <div className="alsk alsk-avatar" />
              <div className="alsk-body">
                <div className="alsk alsk-title" />
                <div className="alsk alsk-line" />
                <div className="alsk alsk-line alsk-short" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="al-empty">
          <i className="fas fa-user-graduate" />
          <h4>No Alumni Found</h4>
          <p>{search ? `No results for "${search}"` : 'Click "Add Alumni" to add your first record'}</p>
        </div>
      ) : (
        <div className="al-grid">
          {filtered.map((r, idx) => (
            <div className={`al-card ${r.isHighlight ? "highlight" : ""}`} key={r._id}>

              {/* Photo area */}
              <div className="al-card-photo">
                {r.photo ? (
                  <img src={r.photo} alt={r.name} />
                ) : (
                  <div className="al-card-initials">
                    <span>{initials(r.name)}</span>
                  </div>
                )}
                <div className="al-card-idx">#{idx + 1}</div>
                {r.isHighlight && <div className="al-hl-ribbon">★ Highlight</div>}
                <span className="al-year-badge-abs">{r.passoutYear}</span>

                {/* Overlay actions */}
                <div className="al-card-overlay">
                  <button className="al-ov-edit" onClick={() => openEdit(r)}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  <button className="al-ov-del" onClick={() => handleDelete(r._id, r.name)}>
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="al-card-body">
                <p className="al-card-name">{r.name}</p>
                <div className="al-card-meta">
                  {r.position && (
                    <span className="al-meta-item">
                      <i className="fas fa-briefcase" /> {r.position}
                    </span>
                  )}
                  {r.company && (
                    <span className="al-meta-item">
                      <i className="fas fa-building" /> {r.company}
                    </span>
                  )}
                  {r.location && (
                    <span className="al-meta-item">
                      <i className="fas fa-map-marker-alt" /> {r.location}
                    </span>
                  )}
                </div>
                {r.quote && (
                  <p className="al-card-quote">"{r.quote}"</p>
                )}

                {/* Footer */}
                <div className="al-card-footer">
                  <span className="al-batch-tag">{r.batch}</span>
                  <div className="al-card-actions">
                    {r.linkedinUrl && (
                      <a
                        href={r.linkedinUrl} target="_blank" rel="noreferrer"
                        className="al-btn-linkedin" title="LinkedIn Profile"
                      >
                        <i className="fab fa-linkedin-in" />
                      </a>
                    )}
                    <button className="exam-btn-edit" onClick={() => openEdit(r)}>
                      <i className="fas fa-edit" /><span>Edit</span>
                    </button>
                    <button className="exam-btn-delete" onClick={() => handleDelete(r._id, r.name)}>
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════ MODAL ══════════════════════ */}
      {showModal && (
        <div className="al-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="al-modal">

            <div className="al-modal-header">
              <div className="al-modal-header-left">
                <div className="al-modal-icon">🎓</div>
                <div>
                  <h3>{isEdit ? "Update Alumni" : "Add Alumni"}</h3>
                  <p className="al-modal-sub">Record an alumni profile shown on the public page</p>
                </div>
              </div>
              <button
                type="button" className="al-modal-close"
                onClick={() => setShowModal(false)} aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form
              className="al-modal-form"
              onSubmit={e => { e.preventDefault(); handleSubmit(e); }}
            >
              <div className="al-modal-body">

                {/* Name + Batch */}
                <div className="al-row">
                  <div className="al-field">
                    <label className="al-label">Full Name <span className="al-req">*</span></label>
                    <input
                      autoFocus className="al-input"
                      name="name" value={form.name}
                      onChange={handleChange} required
                      placeholder="e.g. Ananya Dash"
                    />
                  </div>
                  <div className="al-field">
                    <label className="al-label">Batch <span className="al-req">*</span></label>
                    <input
                      className="al-input"
                      name="batch" value={form.batch}
                      onChange={handleChange} required
                      placeholder="e.g. 2018–2022"
                    />
                  </div>
                </div>

                {/* Passout Year + Position */}
                <div className="al-row">
                  <div className="al-field">
                    <label className="al-label">
                      Passout Year <span className="al-req">*</span>
                      <span className="al-optional"> (for filter tabs)</span>
                    </label>
                    <input
                      className="al-input"
                      name="passoutYear" value={form.passoutYear}
                      onChange={handleChange} required
                      placeholder="e.g. 2022"
                    />
                  </div>
                  <div className="al-field">
                    <label className="al-label">Current Position</label>
                    <input
                      className="al-input"
                      name="position" value={form.position}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>

                {/* Company + Location */}
                <div className="al-row">
                  <div className="al-field">
                    <label className="al-label">Company</label>
                    <input
                      className="al-input"
                      name="company" value={form.company}
                      onChange={handleChange}
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div className="al-field">
                    <label className="al-label">Location</label>
                    <input
                      className="al-input"
                      name="location" value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore, India"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="al-field">
                  <label className="al-label">LinkedIn URL</label>
                  <div className="al-input-icon-wrap">
                    <i className="fab fa-linkedin al-input-icon" />
                    <input
                      className="al-input al-input-with-icon"
                      name="linkedinUrl" value={form.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                {/* Quote */}
                <div className="al-field">
                  <label className="al-label">
                    Quote / Testimonial
                    <span className="al-optional"> (optional)</span>
                  </label>
                  <textarea
                    className="al-input al-textarea" rows={3}
                    name="quote" value={form.quote}
                    onChange={handleChange}
                    placeholder="Alumni's message about their experience…"
                  />
                </div>

                {/* Photo upload */}
                <div className="al-field">
                  <label className="al-label">
                    Profile Photo
                    <span className="al-optional"> (optional)</span>
                  </label>
                  <div className="al-upload" onClick={() => fileRef.current.click()}>
                    {preview ? (
                      <div className="al-preview-wrap">
                        <img src={preview} alt="preview" className="al-preview-img" />
                        <div className="al-preview-overlay"><span>🔄 Change Photo</span></div>
                      </div>
                    ) : (
                      <div className="al-upload-empty">
                        <span className="al-upload-icon">👤</span>
                        <span>Tap to upload profile photo</span>
                        <span className="al-upload-hint">JPG, PNG, WebP · Max 5MB</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef} type="file" accept="image/*" hidden
                    onChange={e => {
                      const f = e.target.files[0];
                      if (f) { setPhoto(f); setPreview(URL.createObjectURL(f)); }
                    }}
                  />
                </div>

                {/* Highlight toggle */}
                <label className="al-highlight-toggle">
                  <input
                    type="checkbox" name="isHighlight"
                    checked={form.isHighlight} onChange={handleChange}
                  />
                  <div>
                    <span>★ Mark as Highlight</span>
                    <span className="al-toggle-sub">Featured prominently on the public alumni page</span>
                  </div>
                </label>

              </div>{/* end modal-body */}

              <div className="al-modal-footer">
                <button
                  type="button" className="al-btn al-btn--cancel"
                  onClick={() => setShowModal(false)}
                >Cancel</button>
                <button
                  type="submit" className="al-btn al-btn--submit"
                  disabled={saving}
                >
                  {saving ? <span className="al-spinner" /> : null}
                  {saving ? "Saving…" : isEdit ? "Update Alumni" : "🎓 Add Alumni"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}