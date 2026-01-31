// src/pages/Notices/Notices.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import './Notices.css';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = () => {
      // Mock data representing your future MongoDB response
      const mockNotices = [
        { _id: '101', title: "Revised Examination Schedule for BCA 4th Semester", date: "2026-01-12", type: "Exam", isUrgent: true, fileUrl: "#" },
        { _id: '102', title: "Registration for Summer Internship Programme 2026", date: "2026-01-08", type: "General", isUrgent: false, fileUrl: "#" },
        { _id: '103', title: "Holiday Notice: Republic Day Celebration", date: "2026-01-20", type: "Holiday", isUrgent: false, fileUrl: "#" },
        { _id: '104', title: "Submission of Minor Project Synopsis - Batch 2023-26", date: "2026-01-05", type: "Academic", isUrgent: true, fileUrl: "#" }
      ];

      setTimeout(() => {
        setNotices(mockNotices);
        setLoading(false);
      }, 1500); // Increased time slightly to appreciate the professional loading effect
    };
    fetchNotices();
  }, []);

  return (
    <div className="notices-page-container container section-padding">
      <SectionTitle 
        title="Official Notices" 
        subtitle="Access official circulars, academic schedules, and department announcements" 
      />

      <div className="notices-wrapper">
        <div className="notices-header-row">
          <div className="col-date">Date</div>
          <div className="col-subject">Subject / Notice Title</div>
          <div className="col-type">Category</div>
          <div className="col-action">Action</div>
        </div>

        {loading ? (
          <div className="notices-list">
            {/* 3 Skeleton Rows that match the design structure */}
            {[1, 2, 3].map(n => (
              <div key={n} className="notice-item skeleton-row">
                <div className="col-date"><div className="skeleton skeleton-box"></div></div>
                <div className="col-subject">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-subtitle"></div>
                </div>
                <div className="col-type"><div className="skeleton skeleton-badge"></div></div>
                <div className="col-action"><div className="skeleton skeleton-btn"></div></div>
              </div>
            ))}
          </div>
        ) : notices.length > 0 ? (
          <div className="notices-list">
            {notices.map((notice) => (
              <div key={notice._id} className={`notice-item ${notice.isUrgent ? 'urgent' : ''}`}>
                <div className="col-date">
                  <span className="date-box">
                    <strong>{new Date(notice.date).getDate()}</strong>
                    {new Date(notice.date).toLocaleString('en-US', { month: 'short' })}
                  </span>
                </div>
                
                <div className="col-subject">
                  <h4 className="notice-title">
                    {notice.title}
                    {notice.isUrgent && <span className="badge-urgent">Urgent</span>}
                    {new Date() - new Date(notice.date) < 604800000 && <span className="badge-new">New</span>}
                  </h4>
                  <p className="notice-id">Ref No: GIETU/CSA/2026/{notice._id}</p>
                </div>

                <div className="col-type">
                  <span className={`type-tag ${notice.type.toLowerCase()}`}>{notice.type}</span>
                </div>

                <div className="col-action">
                  <a href={notice.fileUrl} className="btn-view" target="_blank" rel="noreferrer">
                    <i className="fas fa-file-pdf"></i> View
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notices">
            <p>No active notices at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}