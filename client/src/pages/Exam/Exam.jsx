// src/pages/Exam/Exam.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Exam.css';

const TABS = ['Schedules', 'Results', 'Resources'];

export default function Exam() {
  const [activeTab, setActiveTab] = useState('Schedules');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/exam?category=${activeTab}`
        );
        setData(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch exam data:', err);
        setError('Could not load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="exam-page container section-padding">
      <SectionTitle
        title="Examination Cell"
        subtitle="Manage your academic assessment schedules and check results"
      />

      <div className="exam-alert">
        <div className="alert-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <div className="alert-text">
          <strong>Note:</strong> Check the Schedules tab for the latest exam
          timetables and the Results tab for declared results.
        </div>
      </div>

      <div className="exam-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="exam-content">
        {loading ? (
          <div className="exam-list">
            {[1, 2, 3].map((n) => (
              <div key={n} className="exam-item skeleton-row">
                <div className="exam-info">
                  <div className="skeleton sk-text-short"></div>
                  <div className="skeleton sk-text"></div>
                </div>
                <div className="skeleton sk-button"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="no-exam-data">
            <p>{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="no-exam-data">
            <p>No {activeTab.toLowerCase()} available at this time.</p>
          </div>
        ) : (
          <>
            {activeTab === 'Schedules' && (
              <div className="exam-list">
                {data.map((exam) => (
                  <div key={exam._id} className="exam-item">
                    <div className="exam-info">
                      {exam.code && (
                        <span className="exam-code">{exam.code}</span>
                      )}
                      <h4 className="exam-title">{exam.title}</h4>
                    </div>
                    {exam.examDate && (
                      <div className="exam-date">
                        <i className="far fa-clock"></i>{' '}
                        {new Date(exam.examDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                    {exam.fileUrl ? (
                      <a
                        href={exam.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-download"
                      >
                        Download Time-Table
                      </a>
                    ) : (
                      <button className="btn-download" disabled>
                        No File
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Results' && (
              <div className="exam-list">
                {data.map((res) => (
                  <div key={res._id} className="exam-item">
                    <div className="exam-info">
                      <h4 className="exam-title">{res.title}</h4>
                      {res.releaseDate && (
                        <p className="release-date">
                          Released on:{' '}
                          {new Date(res.releaseDate).toLocaleDateString(
                            'en-IN',
                            { day: '2-digit', month: 'short', year: 'numeric' }
                          )}
                        </p>
                      )}
                    </div>
                    {res.fileUrl ? (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view-res"
                      >
                        View Result
                      </a>
                    ) : (
                      <button className="btn-view-res" disabled>
                        Not Available
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Resources' && (
              <div className="resource-grid">
                {data.map((resource) => (
                  <Card key={resource._id} className="resource-card">
                    <i
                      className={`fas ${
                        resource.resourceType === 'PDF'
                          ? 'fa-file-pdf'
                          : 'fa-link'
                      } res-icon`}
                    ></i>
                    <h4>{resource.title}</h4>
                    {resource.fileUrl ? (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="res-link"
                      >
                        Access {resource.resourceType || 'File'}
                      </a>
                    ) : (
                      <span className="res-link disabled">Not Available</span>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}