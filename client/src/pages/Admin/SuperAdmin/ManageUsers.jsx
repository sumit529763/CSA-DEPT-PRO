import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageUsers.css";

export default function ManageUsers() {

  // 🔹 Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Form modal
  const [showForm, setShowForm] = useState(false);
  
  //edit user
  const [editingUser, setEditingUser] = useState(null);
  
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // 🔹 Form data
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    bio: "",
    research: "",
    email: "",
    password: "",
    photo: null,
  });

  // 🚀 Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.data || []);

    } catch (err) {
      console.log("FETCH USERS ERROR 👉", err);
      console.log("RESPONSE 👉", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 Handle Input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ➕ Create Admin
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await axios.post(
        "http://localhost:5000/api/users/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Admin Created ✅");

      setShowForm(false);

      setFormData({
        name: "",
        designation: "",
        bio: "",
        research: "",
        email: "",
        password: "",
        photo: null,
      });

      fetchUsers();

    } catch (err) {
      console.log("FULL ERROR 👉", err);
      console.log("RESPONSE DATA 👉", err.response?.data);
      console.log("STATUS 👉", err.response?.status);

      alert(err.response?.data?.message || "Error creating user ❌");
    }
  };

  // ✏️ Update Admin
  const handleUpdate = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Admin updated successfully");

      setEditingUser(null);
      fetchUsers();

    } catch (error) {
      console.log("UPDATE ERROR 👉", error);
    }
  };

  // ❌ Delete User
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!window.confirm("Delete this admin?")) return;

      await axios.delete(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User Deleted ✅");
      fetchUsers();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manageUsersPage">

      {/* 🔷 Header */}
      <div className="usersHeader">
        <div>
          <h2>User Management</h2>
          <p>Assign roles & control system access</p>
        </div>

        <button
          className="addAdminBtn"
          onClick={() => setShowForm(true)}
        >
          + Add Admin
        </button>
      </div>

      {/* 🔷 Modal Form */}
      {showForm && (
        <div className="modal">
          <div className="modalContent">

            <h3>Create Admin</h3>

            <form onSubmit={handleCreate}>

              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
              />

              <input
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <textarea
                name="bio"
                placeholder="Bio"
                onChange={handleChange}
              />

              <textarea
                name="research"
                placeholder="Research"
                onChange={handleChange}
              />

              <input
                type="file"
                name="photo"
                onChange={handleChange}
              />

              <div className="modalActions">
                <button type="submit">Create</button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 🔷 Users Grid */}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="usersGrid">

          {Array.isArray(users) && users.map((u) => (
            <div className="userCard" key={u._id}>

              <div className="userTop">
                <h4>{u.name}</h4>

                <span className={`roleTag ${u.role}`}>
                  {u.role === "superadmin"
                    ? "Super Admin"
                    : "Admin"}
                </span>
              </div>

              <p className="userEmail">{u.email}</p>

              <div className="userBottom">

                <span className={`status ${u.isActive ? "Active" : "Inactive"}`}>
                  {u.isActive ? "Active" : "Inactive"}
                </span>

                <div className="userActions">
                  <button onClick={() => handleEdit(u)}>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* 🔷 Edit Modal */}
      {/* 🔷 Edit Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modalContent">

            <h3>Edit Admin</h3>

            <input
              name="name"
              value={editingUser.name || ""}
              placeholder="Name"
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />

            <input
              name="designation"
              value={editingUser.designation || ""}
              placeholder="Designation"
              onChange={(e) =>
                setEditingUser({ ...editingUser, designation: e.target.value })
              }
            />

            <input
              name="email"
              type="email"
              value={editingUser.email || ""}
              placeholder="Email"
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />

            <input
              name="password"
              type="password"
              placeholder="New Password (optional)"
              onChange={(e) =>
                setEditingUser({ ...editingUser, password: e.target.value })
              }
            />

            <textarea
              name="bio"
              value={editingUser.bio || ""}
              placeholder="Bio"
              onChange={(e) =>
                setEditingUser({ ...editingUser, bio: e.target.value })
              }
            />

            <textarea
              name="research"
              value={editingUser.research || ""}
              placeholder="Research"
              onChange={(e) =>
                setEditingUser({ ...editingUser, research: e.target.value })
              }
            />

            <input
              type="file"
              name="photo"
              onChange={(e) =>
                setEditingUser({ ...editingUser, photo: e.target.files[0] })
              }
            />

            <div className="modalActions">

              <button onClick={handleUpdate}>
                Update
              </button>

              <button onClick={() => setEditingUser(null)}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}