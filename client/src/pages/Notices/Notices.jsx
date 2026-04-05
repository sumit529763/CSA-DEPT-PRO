// src/pages/Notices/Notices.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionTitle from '../../components/UI/SectionTitle';
import './Notices.css';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/notices`
        );
        setNotices(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
        setError('Could not load notices. Please try again later.');
      } finally {
        setLoading(false);
      }
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
            {[1, 2, 3].map((n) => (
              <div key={n} className="notice-item skeleton-row">
                <div className="col-date">
                  <div className="skeleton skeleton-box"></div>
                </div>
                <div className="col-subject">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-subtitle"></div>
                </div>
                <div className="col-type">
                  <div className="skeleton skeleton-badge"></div>
                </div>
                <div className="col-action">
                  <div className="skeleton skeleton-btn"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="no-notices">
            <p>{error}</p>
          </div>
        ) : notices.length > 0 ? (
          <div className="notices-list">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className={`notice-item ${notice.isUrgent ? 'urgent' : ''}`}
              >
                <div className="col-date">
                  <span className="date-box">
                    <strong>{new Date(notice.date).getDate()}</strong>
                    {new Date(notice.date).toLocaleString('en-US', {
                      month: 'short',
                    })}
                  </span>
                </div>

                <div className="col-subject">
                  <h4 className="notice-title">
                    {notice.title}
                    {notice.isUrgent && (
                      <span className="badge-urgent">Urgent</span>
                    )}
                    {new Date() - new Date(notice.date) < 604800000 && (
                      <span className="badge-new">New</span>
                    )}
                  </h4>
                  <p className="notice-id">
                    Ref No: GIETU/CSA/
                    {new Date(notice.date).getFullYear()}/
                    {notice._id.slice(-5).toUpperCase()}
                  </p>
                </div>

                <div className="col-type">
                  <span className={`type-tag ${notice.type.toLowerCase()}`}>
                    {notice.type}
                  </span>
                </div>

                <div className="col-action">
                  {notice.fileUrl ? (
                    <a
                      href={notice.fileUrl}
                      className="btn-view"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fas fa-file-pdf"></i> View
                    </a>
                  ) : (
                    <span className="btn-view disabled">No File</span>
                  )}
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