// src/pages/Exam/Exam.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Exam.css';

export default function Exam() {
  const [activeTab, setActiveTab] = useState('Schedules');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch when page loads or tab changes
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const examData = {
    Schedules: [
      { id: 1, title: "BCA 1st Year Semester-I Final Exam", date: "Feb 10, 2026", code: "CS-101" },
      { id: 2, title: "BCA 2nd Year Semester-III Final Exam", date: "Feb 12, 2026", code: "CS-302" },
      { id: 3, title: "BCA 3rd Year Semester-V Lab Viva-Voce", date: "Feb 05, 2026", code: "CS-505P" },
    ],
    Results: [
      { id: 4, title: "BCA Semester-II (Backlog) Results - 2025", releaseDate: "Jan 10, 2026" },
      { id: 5, title: "BCA Semester-IV Regular Results - 2025", releaseDate: "Dec 28, 2025" },
    ],
    Resources: [
      { id: 6, title: "Examination Rules & Regulations Handbook", type: "PDF" },
      { id: 7, title: "Admit Card Download (Feb 2026 Session)", type: "Link" },
    ]
  };

  return (
    <div className="exam-page container section-padding">
      <SectionTitle 
        title="Examination Cell" 
        subtitle="Manage your academic assessment schedules and check results" 
      />

      <div className="exam-alert">
        <div className="alert-icon"><i className="fas fa-exclamation-circle"></i></div>
        <div className="alert-text">
          <strong>Active Notification:</strong> Fill up of Semester Examination forms for Feb-2026 session is open until Jan 25, 2026.
        </div>
      </div>

      <div className="exam-tabs">
        {Object.keys(examData).map(tab => (
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
          /* --- SKELETON STATE FOR EXAM LIST --- */
          <div className="exam-list">
            {[1, 2, 3].map(n => (
              <div key={n} className="exam-item skeleton-row">
                <div className="exam-info">
                  <div className="skeleton sk-text-short"></div>
                  <div className="skeleton sk-text"></div>
                </div>
                <div className="skeleton sk-button"></div>
              </div>
            ))}
          </div>
        ) : (
          /* --- ACTUAL CONTENT --- */
          <>
            {activeTab === 'Schedules' && (
              <div className="exam-list">
                {examData.Schedules.map(exam => (
                  <div key={exam.id} className="exam-item">
                    <div className="exam-info">
                      <span className="exam-code">{exam.code}</span>
                      <h4 className="exam-title">{exam.title}</h4>
                    </div>
                    <div className="exam-date"><i className="far fa-clock"></i> {exam.date}</div>
                    <button className="btn-download">Download Time-Table</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Results' && (
              <div className="exam-list">
                {examData.Results.map(res => (
                  <div key={res.id} className="exam-item">
                    <div className="exam-info">
                      <h4 className="exam-title">{res.title}</h4>
                      <p className="release-date">Released on: {res.releaseDate}</p>
                    </div>
                    <button className="btn-view-res">View Result</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Resources' && (
              <div className="resource-grid">
                {examData.Resources.map(res => (
                  <Card key={res.id} className="resource-card">
                    <i className={`fas ${res.type === 'PDF' ? 'fa-file-pdf' : 'fa-link'} res-icon`}></i>
                    <h4>{res.title}</h4>
                    <a href="#" className="res-link">Access {res.type}</a>
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