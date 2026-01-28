// src/pages/Faculty/Faculty.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Faculty.css';

import hodpic from '../../assets/images/hod-pic.jpeg';

export default function Faculty() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ hod: null, teachingStaff: [] });

  useEffect(() => {
    // Simulating MongoDB fetch delay
    const timer = setTimeout(() => {
      setData({
        hod: {
          name: "Prof. Satya Narayan Das",
          designation: "Head of Department",
          qualification: "Ph.D. in Computer Science",
          specialization: "Artificial Intelligence & Soft Computing",
          image: hodpic,
          email: "hod.csa@giet.edu"
        },
        teachingStaff: [
          { id: 1, name: "Ms. Soumya Ranjan Mishra", designation: "Assistant Professor", specialization: "Database Management & SQL", image: hodpic, email: "soumyaranjan@giet.edu" },
          { id: 2, name: "Placeholder Staff", designation: "Associate Professor", specialization: "Machine Learning & Python", image: hodpic, email: "staff2@giet.edu" },
          { id: 3, name: "Placeholder Staff", designation: "Assistant Professor", specialization: "Web Technologies & React", image: hodpic, email: "staff3@giet.edu" }
        ]
      });
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="faculty-page container section-padding">
      <SectionTitle 
        title="Our Faculty" 
        subtitle="Meet the experienced educators leading the next generation of tech innovators" 
      />

      {/* 👑 HOD Section */}
      <div className="hod-section">
        {loading ? (
          <div className="hod-card skeleton-card">
            <div className="skeleton sk-hod-img"></div>
            <div className="hod-info">
              <div className="skeleton sk-text-short"></div>
              <div className="skeleton sk-text"></div>
              <div className="skeleton sk-text"></div>
              <div className="skeleton sk-text-short"></div>
            </div>
          </div>
        ) : (
          <div className="hod-card">
            <div className="hod-image-container">
              <img src={data.hod.image} alt={data.hod.name} />
            </div>
            <div className="hod-info">
              <span className="hod-badge">Leadership</span>
              <h2 className="hod-name">{data.hod.name}</h2>
              <p className="hod-designation">{data.hod.designation}</p>
              <p className="hod-qualification"><strong>Education:</strong> {data.hod.qualification}</p>
              <p className="hod-spec"><strong>Focus:</strong> {data.hod.specialization}</p>
              <div className="hod-contact">
                <a href={`mailto:${data.hod.email}`} className="contact-link">
                  <i className="fas fa-envelope"></i> {data.hod.email}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <h3 className="sub-section-heading">Faculty Members</h3>
      
      {/* 👨‍🏫 Teaching Staff Grid */}
      <div className="faculty-grid">
        {loading ? (
          [1, 2, 3].map(n => (
            <Card key={n} className="faculty-card skeleton-card">
              <div className="skeleton sk-faculty-img"></div>
              <div className="faculty-details">
                <div className="skeleton sk-text"></div>
                <div className="skeleton sk-text-short"></div>
              </div>
            </Card>
          ))
        ) : (
          data.teachingStaff.map((member) => (
            <Card key={member.id} className="faculty-card">
              <div className="faculty-img-wrapper">
                <img src={member.image} alt={member.name} />
                <div className="faculty-overlay">
                  <a href={`mailto:${member.email}`} title="Email Profile"><i className="fas fa-envelope"></i></a>
                  <a href="#" title="LinkedIn Profile"><i className="fab fa-linkedin"></i></a>
                </div>
              </div>
              <div className="faculty-details">
                <h4 className="faculty-name">{member.name}</h4>
                <p className="faculty-rank">{member.designation}</p>
                <span className="faculty-specialty">{member.specialization}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}