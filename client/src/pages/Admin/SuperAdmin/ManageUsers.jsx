import React, { useState } from "react";
import "./ManageUsers.css";

export default function ManageUsers() {

  const [users] = useState([
    { id: 1, name: "Dr. S. Panda", email: "hod.csa@giet.edu", role: "super-admin", status: "Active" },
    { id: 2, name: "Sumit Naik", email: "sumit.naik@giet.edu", role: "admin", status: "Active" },
    { id: 3, name: "Technical Lead", email: "tech@giet.edu", role: "admin", status: "Inactive" },
  ]);

  return (
    <div className="manageUsersPage">

      <div className="usersHeader">
        <div>
          <h2>User Management</h2>
          <p>Assign roles & control system access</p>
        </div>

        <button className="addAdminBtn">
          + Add Admin
        </button>
      </div>

      <div className="usersGrid">

        {users.map((u) => (
          <div className="userCard" key={u.id}>

            <div className="userTop">
              <h4>{u.name}</h4>
              <span className={`roleTag ${u.role}`}>
                {u.role === "super-admin" ? "Super Admin" : "Admin"}
              </span>
            </div>

            <p className="userEmail">{u.email}</p>

            <div className="userBottom">

              <span className={`status ${u.status}`}>
                {u.status}
              </span>

              <div className="userActions">
                <button>Edit</button>
                <button>Disable</button>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
