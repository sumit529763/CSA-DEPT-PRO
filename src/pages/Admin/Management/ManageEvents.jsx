// src/pages/Admin/Management/ManageEvents.jsx
import React, { useState } from "react";
import "../Styles/Management.css";

export default function ManageEvents() {
  // Mock data - eventually fetched from your MongoDB
  const [events, setEvents] = useState([
    { id: 1, name: "Tech Fest 2026", date: "2026-03-20", venue: "CSA Seminar Hall" },
    { id: 2, name: "Alumni Meet", date: "2026-02-14", venue: "University Auditorium" },
  ]);

  return (
    <div className="management-view">
      <div className="management-header">
        <div className="header-text">
          <h2>Manage Events</h2>
          <p>Update the academic and cultural event calendar.</p>
        </div>
        <button className="btn-add">
          <i className="fas fa-calendar-plus"></i> Create New Event
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td data-label="Event Name" className="font-bold">{event.name}</td>
                <td data-label="Date">{event.date}</td>
                <td data-label="Venue">{event.venue}</td>
                <td data-label="Actions">
                  <div className="action-btns">
                    <button className="btn-edit" title="Edit"><i className="fas fa-edit"></i></button>
                    <button className="btn-delete" title="Delete"><i className="fas fa-trash"></i></button>
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




