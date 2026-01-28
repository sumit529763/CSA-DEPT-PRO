// src/pages/Admin/SuperAdmin/AuditLogs.jsx
import React, { useState } from "react";
import "../../Admin/Styles/Management.css";
import "../../Admin/Styles/SuperAdmin.css";

export default function AuditLogs() {
  // Mock data for system activities
  const [logs, setLogs] = useState([
    { id: 1, admin: "Sumit Naik", action: "Deleted Gallery Image", target: "Lab_View_01", timestamp: "2026-01-21 14:30" },
    { id: 2, admin: "Dr. S. Panda", action: "Added News", target: "Placement Drive 2026", timestamp: "2026-01-20 10:15" },
    { id: 3, admin: "Admin_Lead", action: "Updated Event", target: "Tech Fest 2026", timestamp: "2026-01-19 16:45" },
  ]);

  return (
    <div className="management-view super-admin-view">
      <div className="management-header">
        <div className="header-text">
          <h2>Security Audit Logs</h2>
          <p>Review all administrative actions performed on the CSA server.</p>
        </div>
        <div className="header-actions">
           <input type="text" placeholder="Search logs..." className="admin-search-input" />
           <button className="btn-export"><i className="fas fa-file-download"></i> Export PDF</button>
        </div>
      </div>

      <div className="table-container shadow-premium">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Administrator</th>
              <th>Action Performed</th>
              <th>Target Item</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td data-label="Timestamp" className="text-muted">{log.timestamp}</td>
                <td data-label="Admin"><strong>{log.admin}</strong></td>
                <td data-label="Action">
                   <span className="action-tag">{log.action}</span>
                </td>
                <td data-label="Target">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}