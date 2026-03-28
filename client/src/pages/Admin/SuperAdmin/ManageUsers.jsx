// src/pages/Admin/SuperAdmin/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageUsers.css";

const API = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

export default function ManageUsers() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData]     = useState({
    name: "", designation: "", bio: "",
    research: "", email: "", password: "", photo: null,
  });

  // ─── Fetch ───────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ─── Form Handlers ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "", designation: "", bio: "",
      research: "", email: "", password: "", photo: null,
    });
    setShowForm(false);
  };

  // ─── Create ───────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v) data.append(k, v); });

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

  // ─── Update ───────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      // Only send changed text fields
      ["name", "designation", "bio", "research", "email"].forEach((k) => {
        if (editingUser[k] !== undefined) data.append(k, editingUser[k]);
      });

      // Only send password if filled
      if (editingUser.newPassword && editingUser.newPassword.trim() !== "") {
        data.append("password", editingUser.newPassword);
      }

      // Only send photo if a new file was picked
      if (editingUser.photoFile) {
        data.append("photo", editingUser.photoFile);
      }

      await axios.put(`${API}/api/users/${editingUser._id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      toast.success("Admin updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ─── Delete ───────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete admin "${name}"? This cannot be undone.`)) return;
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

  // ─── Toggle Active ────────────────────────────────────
  const handleToggle = async (id, currentStatus, name) => {
    try {
      await axios.patch(`${API}/api/users/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success(`${name} ${currentStatus ? "deactivated" : "activated"}`);
      fetchUsers();
    } catch (err) {
      toast.error("Status toggle failed");
    }
  };

  return (
    <div className="manageUsersPage">

      {/* ── Header ── */}
      <div className="usersHeader">
        <div>
          <h2>User Management</h2>
          <p>Assign roles &amp; control system access</p>
        </div>
        <button className="addAdminBtn" onClick={() => setShowForm(true)}>
          + Add Admin
        </button>
      </div>

      {/* ── Stats Bar ── */}
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

              {/* Avatar + Name */}
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
                </div>
                <span className={`roleTag ${u.role}`}>
                  {u.role === "superadmin" ? "Super Admin" : "Admin"}
                </span>
              </div>

              <p className="userEmail">
                <i className="fas fa-envelope"></i> {u.email}
              </p>

              {/* Footer */}
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
                    onClick={() => setEditingUser({ ...u, newPassword: "" })}
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
                  <label>Email *</label>
                  <input name="email" type="email" placeholder="admin@giet.edu" onChange={handleChange} required />
                </div>
                <div className="formGroup">
                  <label>Password *</label>
                  <input name="password" type="password" placeholder="Min 6 characters" onChange={handleChange} required />
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
        <div className="modalOverlay" onClick={() => setEditingUser(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Edit Admin</h3>
              <button className="modalClose" onClick={() => setEditingUser(null)}>✕</button>
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
                <label>New Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditingUser({ ...editingUser, photoFile: e.target.files[0] })}
                />
              </div>
            </div>
            <div className="modalActions">
              <button className="cancelBtn" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="submitBtn" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}