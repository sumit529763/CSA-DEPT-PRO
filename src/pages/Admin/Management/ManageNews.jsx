// src/pages/Admin/Management/ManageNews.jsx
import React, { useState } from "react";
import "../Styles/Management.css";

export default function ManageNews() {
  // Mock data - eventually fetched from your MongoDB via services
  const [news, setNews] = useState([
    { id: 1, title: "New Lab Inauguration", date: "2026-01-15", category: "Academic" },
    { id: 2, title: "Placement Drive 2026", date: "2026-01-10", category: "Placement" },
  ]);

  return (
    <div className="management-view">
      <div className="management-header">
        <div className="header-text">
          <h2>Manage News</h2>
          <p>Create, update, or remove department news articles.</p>
        </div>
        <button className="btn-add">
          <i className="fas fa-plus"></i> Add New News
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id}>
                <td data-label="Title" className="font-bold">{item.title}</td>
                <td data-label="Category"><span className="badge">{item.category}</span></td>
                <td data-label="Date">{item.date}</td>
                <td data-label="Actions">
                  <div className="action-btns">
                    <button className="btn-edit"><i className="fas fa-edit"></i></button>
                    <button className="btn-delete"><i className="fas fa-trash"></i></button>
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