// src/pages/Admin/SuperAdmin/ManageUsers.jsx
import React, { useState } from "react";
import "../../Admin/Styles/SuperAdmin.css";
import "../../Admin/Styles/Management.css";

export default function ManageUsers() {
  // Mock data - In production, this comes from your Manage Users service
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. S. Panda", email: "hod.csa@giet.edu", role: "super-admin", status: "Active" },
    { id: 2, name: "Sumit Naik", email: "sumit.naik@giet.edu", role: "admin", status: "Active" },
    { id: 3, name: "Technical Lead", email: "tech@giet.edu", role: "admin", status: "Inactive" },
  ]);

  return (
    <div className="management-view super-admin-view">
      <div className="management-header">
        <div className="header-text">
          <h2>User Management</h2>
          <p>Control system access and assign administrative roles.</p>
        </div>
        <button className="btn-add btn-super">
          <i className="fas fa-user-plus"></i> Add New Admin
        </button>
      </div>

      <div className="table-container shadow-premium">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td data-label="Name" className="font-bold">{u.name}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Role">
                  <span className={`role-pill ${u.role}`}>
                    {u.role === "super-admin" ? "Super Admin" : "Admin"}
                  </span>
                </td>
                <td data-label="Status">
                  <span className={`status-dot ${u.status.toLowerCase()}`}></span> {u.status}
                </td>
                <td data-label="Actions">
                  <div className="action-btns">
                    <button className="btn-edit"><i className="fas fa-user-edit"></i></button>
                    <button className="btn-delete"><i className="fas fa-user-slash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}