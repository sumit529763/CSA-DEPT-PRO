import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Styles/Management.css";
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
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [years, setYears]         = useState([]);
  const [form, setForm]           = useState(EMPTY);
  const [photo, setPhoto]         = useState(null);
  const [preview, setPreview]     = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = res.data.data || [];
      setRecords(data);
      const yr = [...new Set(data.map(r => r.passoutYear))].sort((a,b) => b.localeCompare(a));
      setYears(yr);
    } catch { toast.error("Failed to load alumni"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

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
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (k !== "id") fd.append(k, v); });
    if (photo) fd.append("photo", photo);
    const cfg = { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } };
    try {
      setSaving(true);
      if (isEdit) await axios.put(`${API}/${form.id}`, fd, cfg);
      else        await axios.post(API, fd, cfg);
      toast.success(isEdit ? "Updated!" : "Alumni added!");
      setShowModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success("Deleted"); fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = records.filter(r => {
    const yearMatch = filterYear === "all" || r.passoutYear === filterYear;
    const q = search.toLowerCase();
    const searchMatch = !search || r.name.toLowerCase().includes(q) || (r.company || "").toLowerCase().includes(q);
    return yearMatch && searchMatch;
  });

  return (
    <div className="management-view">
      {/* Header */}
      <div className="management-header">
        <div>
          <h2 className="management-title">Manage Alumni</h2>
          <p className="management-sub">Add and manage alumni profiles shown on the public Alumni page.</p>
        </div>
        <button className="btn-add" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Alumni
        </button>
      </div>

      {/* Filters */}
      <div className="al-filters">
        <input
          type="text" className="search-input"
          placeholder="Search by name or company..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div className="al-year-tabs">
          <button className={`al-year-tab ${filterYear === "all" ? "active" : ""}`} onClick={() => setFilterYear("all")}>
            All Years
          </button>
          {years.map(y => (
            <button key={y} className={`al-year-tab ${filterYear === y ? "active" : ""}`} onClick={() => setFilterYear(y)}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <p className="loading-text">Loading...</p> : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Batch</th>
                <th>Year</th>
                <th>Position</th>
                <th>Company</th>
                <th>Highlight</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign:"center", padding:"30px", color:"#94a3b8" }}>No alumni found.</td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    {r.photo
                      ? <img src={r.photo} alt={r.name} className="al-thumb" />
                      : <div className="al-thumb-placeholder">{r.name.charAt(0).toUpperCase()}</div>
                    }
                  </td>
                  <td className="td-bold">{r.name}</td>
                  <td><span className="al-batch-badge">{r.batch}</span></td>
                  <td><span className="al-year-badge">{r.passoutYear}</span></td>
                  <td>{r.position || <span style={{color:"#94a3b8"}}>—</span>}</td>
                  <td>{r.company  || <span style={{color:"#94a3b8"}}>—</span>}</td>
                  <td>{r.isHighlight ? <span className="hl-yes">★ Yes</span> : <span className="hl-no">No</span>}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit"   onClick={() => openEdit(r)}><i className="fas fa-edit"></i></button>
                      <button className="btn-delete" onClick={() => handleDelete(r._id, r.name)}><i className="fas fa-trash"></i></button>
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
          <div className="modal-box al-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEdit ? "Edit Alumni" : "Add Alumni"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>

            <form onSubmit={handleSubmit} className="al-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Ananya Dash" />
                </div>
                <div className="form-group">
                  <label>Batch *</label>
                  <input name="batch" value={form.batch} onChange={handleChange} required placeholder="e.g. 2018-2021" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Passout Year * <span className="form-hint">(used for filtering)</span></label>
                  <input name="passoutYear" value={form.passoutYear} onChange={handleChange} required placeholder="e.g. 2021" />
                </div>
                <div className="form-group">
                  <label>Current Position</label>
                  <input name="position" value={form.position} onChange={handleChange} placeholder="e.g. Software Engineer" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Company</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore, India" />
                </div>
              </div>

              <div className="form-group">
                <label>LinkedIn URL</label>
                <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
              </div>

              <div className="form-group">
                <label>Quote / Testimonial</label>
                <textarea name="quote" value={form.quote} onChange={handleChange} rows={3} placeholder="Alumni's message about their experience..." />
              </div>

              <div className="form-group">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={e => { setPhoto(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} />
                {preview && <img src={preview} alt="preview" className="al-img-preview" />}
              </div>

              <div className="form-group form-group-check">
                <input type="checkbox" id="alHL" name="isHighlight" checked={form.isHighlight} onChange={handleChange} />
                <label htmlFor="alHL">★ Mark as Highlight (featured prominently)</label>
              </div>

              <div className="al-modal-footer">
                <button type="button" className="btn-cancel-al" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save-al" disabled={saving}>
                  {saving ? "Saving..." : isEdit ? "Update" : "Add Alumni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}