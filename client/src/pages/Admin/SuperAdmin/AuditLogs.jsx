import React, { useState } from "react";
import "./AuditLogs.css";

export default function AuditLogs() {

  const [logs] = useState([
    { id: 1, admin: "Sumit Naik", action: "Deleted Gallery Image", target: "Lab_View_01", timestamp: "2026-01-21 14:30" },
    { id: 2, admin: "Dr. S. Panda", action: "Added News", target: "Placement Drive 2026", timestamp: "2026-01-20 10:15" },
    { id: 3, admin: "Admin_Lead", action: "Updated Event", target: "Tech Fest 2026", timestamp: "2026-01-19 16:45" },
  ]);

  return (
    <div className="auditLogsPage">

      <div className="logsHeader">
        <h2>Security Logs</h2>
        <input type="text" placeholder="Search logs..." />
      </div>

      <div className="logsTimeline">

        {logs.map((log) => (
          <div className="logCard" key={log.id}>

            <div className="logTime">
              {log.timestamp}
            </div>

            <div className="logInfo">
              <strong>{log.admin}</strong>
              <p>{log.action} → {log.target}</p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
