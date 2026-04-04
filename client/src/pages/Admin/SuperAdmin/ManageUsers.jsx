import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageUsers.css"

const API = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

export default function ManageUsers() {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ── expertise input helper ──
  const [expertiseInput, setExpertiseInput] = useState("");

  const [formData, setFormData] = useState({
    name: "", designation: "", qualification: "",
    specialization: "", bio: "", research: "",
    email: "", password: "", photo: null,
    scholarUrl: "", expertise: [], isHOD: false,
  });

  // ── Fetch ──
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "", designation: "", qualification: "",
      specialization: "", bio: "", research: "",
      email: "", password: "", photo: null,
      scholarUrl: "", expertise: [], isHOD: false,
    });
    setExpertiseInput("");
    setShowForm(false);
  };

  // ── Expertise tag helpers ──
  const addExpertise = (isEdit = false) => {
    const val = expertiseInput.trim();
    if (!val) return;
    if (isEdit) {
      if (!editingUser.expertise.includes(val))
        setEditingUser((prev) => ({ ...prev, expertise: [...prev.expertise, val] }));
    } else {
      if (!formData.expertise.includes(val))
        setFormData((prev) => ({ ...prev, expertise: [...prev.expertise, val] }));
    }
    setExpertiseInput("");
  };

  const removeExpertise = (tag, isEdit = false) => {
    if (isEdit) {
      setEditingUser((prev) => ({
        ...prev,
        expertise: prev.expertise.filter((t) => t !== tag),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        expertise: prev.expertise.filter((t) => t !== tag),
      }));
    }
  };

  // ── Create ──
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === "expertise") data.append(k, JSON.stringify(v));
        else if (k === "isHOD") data.append(k, v);
        else if (v) data.append(k, v);
      });

      await axios.post(`${API}/api/users/create`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      toast.success("Admin created successfully");
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    }
  };

  // ── Update ──
  const handleUpdate = async () => {
    try {
      const data = new FormData();
      ["name","designation","qualification","specialization",
       "bio","research","email","scholarUrl"].forEach((k) => {
        if (editingUser[k] !== undefined) data.append(k, editingUser[k]);
      });
      data.append("isHOD", editingUser.isHOD || false);
      data.append("expertise", JSON.stringify(editingUser.expertise || []));
      if (editingUser.newPassword?.trim())
        data.append("password", editingUser.newPassword);
      if (editingUser.photoFile)
        data.append("photo", editingUser.photoFile);

      await axios.put(`${API}/api/users/${editingUser._id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      toast.success("Admin updated successfully");
      setEditingUser(null);
      setExpertiseInput("");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete admin "${name}"?`)) return;
    try {
      await axios.delete(`${API}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Admin deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ── Toggle Active ──
  const handleToggle = async (id, currentStatus, name) => {
    try {
      await axios.patch(`${API}/api/users/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success(`${name} ${currentStatus ? "deactivated" : "activated"}`);
      fetchUsers();
    } catch {
      toast.error("Status toggle failed");
    }
  };

  // ── Expertise tag UI ──
  const ExpertiseTags = ({ tags, onRemove, isEdit }) => (
    <div className="expertise-tags-wrap">
      {tags.map((tag) => (
        <span key={tag} className="exp-tag">
          {tag}
          <button type="button" onClick={() => onRemove(tag, isEdit)}>✕</button>
        </span>
      ))}
    </div>
  );

  const ExpertiseInput = ({ isEdit }) => (
    <div className="expertise-input-row">
      <input
        type="text"
        placeholder="Add expertise tag (e.g. Machine Learning)"
        value={expertiseInput}
        onChange={(e) => setExpertiseInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExpertise(isEdit); } }}
      />
      <button type="button" className="add-tag-btn" onClick={() => addExpertise(isEdit)}>
        + Add
      </button>
    </div>
  );

  return (
    <div className="manageUsersPage">

      {/* ── Header ── */}
      <div className="usersHeader">
        <div>
          <h2>User Management</h2>
          <p>Assign roles, control access &amp; manage faculty profiles</p>
        </div>
        <button className="addAdminBtn" onClick={() => setShowForm(true)}>
          + Add Admin
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="usersStats">
        <div className="statItem">
          <span className="statNum">{users.length}</span>
          <span className="statLabel">Total Admins</span>
        </div>
        <div className="statItem">
          <span className="statNum">{users.filter(u => u.isActive).length}</span>
          <span className="statLabel">Active</span>
        </div>
        <div className="statItem">
          <span className="statNum">{users.filter(u => !u.isActive).length}</span>
          <span className="statLabel">Inactive</span>
        </div>
        <div className="statItem">
          <span className="statNum">{users.filter(u => u.isHOD).length}</span>
          <span className="statLabel">HOD</span>
        </div>
      </div>

      {/* ── Users Grid ── */}
      {loading ? (
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="emptyState">
          <i className="fas fa-users-slash"></i>
          <p>No admins found</p>
        </div>
      ) : (
        <div className="usersGrid">
          {users.map((u) => (
            <div className={`userCard ${!u.isActive ? "inactive" : ""}`} key={u._id}>
              <div className="userTop">
                <div className="userAvatar">
                  {u.photo
                    ? <img src={u.photo} alt={u.name} />
                    : <span>{u.name?.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <div className="userInfo">
                  <h4>{u.name}</h4>
                  <p className="userDesignation">{u.designation || "Admin"}</p>
                  {u.isHOD && <span className="hod-badge-tag">👑 HOD</span>}
                </div>
                <span className={`roleTag ${u.role}`}>
                  {u.role === "superadmin" ? "Super Admin" : "Admin"}
                </span>
              </div>

              <p className="userEmail">
                <i className="fas fa-envelope"></i> {u.email}
              </p>

              {u.specialization && (
                <p className="userSpec">
                  <i className="fas fa-flask"></i> {u.specialization}
                </p>
              )}

              {u.expertise?.length > 0 && (
                <div className="userExpertiseTags">
                  {u.expertise.slice(0, 3).map((tag) => (
                    <span key={tag} className="userExpTag">{tag}</span>
                  ))}
                  {u.expertise.length > 3 && (
                    <span className="userExpTag">+{u.expertise.length - 3}</span>
                  )}
                </div>
              )}

              <div className="userBottom">
                <button
                  className={`toggleBtn ${u.isActive ? "active" : "inactive"}`}
                  onClick={() => handleToggle(u._id, u.isActive, u.name)}
                >
                  {u.isActive ? "● Active" : "○ Inactive"}
                </button>
                <div className="userActions">
                  <button
                    className="editBtn"
                    onClick={() => setEditingUser({
                      ...u,
                      newPassword: "",
                      photoFile: null,
                    })}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(u._id, u.name)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Modal ── */}
      {showForm && (
        <div className="modalOverlay" onClick={resetForm}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Create New Admin</h3>
              <button className="modalClose" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="formGrid">
                <div className="formGroup">
                  <label>Full Name *</label>
                  <input name="name" placeholder="Dr. John Doe" onChange={handleChange} required />
                </div>
                <div className="formGroup">
                  <label>Designation</label>
                  <input name="designation" placeholder="Assistant Professor" onChange={handleChange} />
                </div>
                <div className="formGroup">
                  <label>Qualification</label>
                  <input name="qualification" placeholder="Ph.D. in Computer Science" onChange={handleChange} />
                </div>
                <div className="formGroup">
                  <label>Specialization</label>
                  <input name="specialization" placeholder="Machine Learning & AI" onChange={handleChange} />
                </div>
                <div className="formGroup">
                  <label>Email *</label>
                  <input name="email" type="email" placeholder="admin@giet.edu" onChange={handleChange} required />
                </div>
                <div className="formGroup">
                  <label>Password *</label>
                  <input name="password" type="password" placeholder="Min 6 characters" onChange={handleChange} required />
                </div>
                <div className="formGroup">
                  <label>Scholar URL</label>
                  <input name="scholarUrl" placeholder="https://scholar.google.com/..." onChange={handleChange} />
                </div>
                <div className="formGroup hod-check">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isHOD"
                      checked={formData.isHOD}
                      onChange={handleChange}
                    />
                    <span>Mark as HOD (Head of Department)</span>
                  </label>
                </div>
                <div className="formGroup full">
                  <label>Bio</label>
                  <textarea name="bio" placeholder="Short bio..." rows={3} onChange={handleChange} />
                </div>
                <div className="formGroup full">
                  <label>Research Interests</label>
                  <textarea name="research" placeholder="Research areas..." rows={2} onChange={handleChange} />
                </div>
                <div className="formGroup full">
                  <label>Expertise Tags</label>
                  <ExpertiseTags tags={formData.expertise} onRemove={removeExpertise} isEdit={false} />
                  <ExpertiseInput isEdit={false} />
                </div>
                <div className="formGroup full">
                  <label>Profile Photo</label>
                  <input type="file" name="photo" accept="image/*" onChange={handleChange} />
                </div>
              </div>
              <div className="modalActions">
                <button type="button" className="cancelBtn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="submitBtn">Create Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editingUser && (
        <div className="modalOverlay" onClick={() => { setEditingUser(null); setExpertiseInput(""); }}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Edit Admin — Faculty Profile</h3>
              <button className="modalClose" onClick={() => { setEditingUser(null); setExpertiseInput(""); }}>✕</button>
            </div>
            <div className="formGrid">
              <div className="formGroup">
                <label>Full Name</label>
                <input
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label>Designation</label>
                <input
                  value={editingUser.designation || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, designation: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label>Qualification</label>
                <input
                  value={editingUser.qualification || ""}
                  placeholder="Ph.D. in Computer Science"
                  onChange={(e) => setEditingUser({ ...editingUser, qualification: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label>Specialization</label>
                <input
                  value={editingUser.specialization || ""}
                  placeholder="Machine Learning & AI"
                  onChange={(e) => setEditingUser({ ...editingUser, specialization: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label>New Password (leave blank to keep)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={editingUser.newPassword || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label>Scholar URL</label>
                <input
                  value={editingUser.scholarUrl || ""}
                  placeholder="https://scholar.google.com/..."
                  onChange={(e) => setEditingUser({ ...editingUser, scholarUrl: e.target.value })}
                />
              </div>
              <div className="formGroup hod-check">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingUser.isHOD || false}
                    onChange={(e) => setEditingUser({ ...editingUser, isHOD: e.target.checked })}
                  />
                  <span>Mark as HOD (Head of Department)</span>
                </label>
              </div>
              <div className="formGroup full">
                <label>Bio</label>
                <textarea
                  rows={3}
                  value={editingUser.bio || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                />
              </div>
              <div className="formGroup full">
                <label>Research Interests</label>
                <textarea
                  rows={2}
                  value={editingUser.research || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, research: e.target.value })}
                />
              </div>
              <div className="formGroup full">
                <label>Expertise Tags</label>
                <ExpertiseTags
                  tags={editingUser.expertise || []}
                  onRemove={removeExpertise}
                  isEdit={true}
                />
                <ExpertiseInput isEdit={true} />
              </div>
              <div className="formGroup full">
                <label>New Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditingUser({ ...editingUser, photoFile: e.target.files[0] })}
                />
              </div>
            </div>
            <div className="modalActions">
              <button className="cancelBtn" onClick={() => { setEditingUser(null); setExpertiseInput(""); }}>Cancel</button>
              <button className="submitBtn" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}