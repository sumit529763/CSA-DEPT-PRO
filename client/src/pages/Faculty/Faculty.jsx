import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
          id: "satya-narayan-das",
          name: "Prof. Satya Narayan Das",
          designation: "Head of Department",
          qualification: "Ph.D. in Computer Science",
          specialization: "AI & Soft Computing",
          image: hodpic,
          email: "hod.csa@giet.edu",
          scholarUrl: "https://scholar.google.com/citations?user=bZcJlw4AAAAJ"
        },
        teachingStaff: [
          { 
            id: "soumya-ranjan-mishra", 
            name: "Ms. Soumya Ranjan Mishra", 
            designation: "Assistant Professor", 
            specialization: "Database Management & SQL", 
            image: hodpic, 
            email: "soumyaranjan@giet.edu",
            scholarUrl: "https://scholar.google.com" 
          },
          { 
            id: "staff-2", 
            name: "Dr. Arun Kumar", 
            designation: "Associate Professor", 
            specialization: "Machine Learning & Python", 
            image: hodpic, 
            email: "arun@giet.edu",
            scholarUrl: "https://scholar.google.com"
          },
          { 
            id: "staff-3", 
            name: "Mr. Rajesh Mohanty", 
            designation: "Assistant Professor", 
            specialization: "Web Technologies", 
            image: hodpic, 
            email: "rajesh@giet.edu",
            scholarUrl: "https://scholar.google.com"
          }
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

      {/* 👑 HOD Spotlight Section */}
      <div className="hod-section">
        {loading ? (
          <div className="hod-card skeleton-card">
            <div className="skeleton sk-hod-img"></div>
            <div className="hod-info">
              <div className="skeleton sk-text-badge"></div>
              <div className="skeleton sk-text-title"></div>
              <div className="skeleton sk-text-p"></div>
              <div className="skeleton sk-text-p"></div>
              <div className="hod-actions">
                 <div className="skeleton sk-btn"></div>
                 <div className="skeleton sk-btn"></div>
              </div>
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
              
              <div className="hod-actions">
                <Link to={`/faculty/${data.hod.id}`} className="btn-profile-main">
                  View Full Profile
                </Link>
                <a href={data.hod.scholarUrl} target="_blank" rel="noreferrer" className="btn-scholar-main">
                  <i className="fas fa-graduation-cap"></i> Google Scholar
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="divider-heading">
        <span>Teaching Faculty</span>
      </div>
      
      {/* 👨‍🏫 Faculty Grid */}
      <div className="faculty-grid">
        {loading ? (
          [1, 2, 3, 4].map((n) => (
            <Card key={n} className="faculty-card skeleton-card">
              <div className="skeleton sk-faculty-img"></div>
              <div className="faculty-details">
                <div className="skeleton sk-text-title-center"></div>
                <div className="skeleton sk-text-p-center"></div>
                <div className="skeleton sk-text-p-center"></div>
              </div>
            </Card>
          ))
        ) : (
          data.teachingStaff.map((member) => (
            <Card key={member.id} className="faculty-card">
              <div className="faculty-img-wrapper">
                <img src={member.image} alt={member.name} />
                <div className="faculty-overlay">
                  <Link to={`/faculty/${member.id}`} title="View Profile">
                    <i className="fas fa-user-tie"></i>
                  </Link>
                  <a href={member.scholarUrl} target="_blank" rel="noreferrer" title="Google Scholar">
                    <i className="fas fa-graduation-cap"></i>
                  </a>
                  <a href={`mailto:${member.email}`} title="Email Staff">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
              <div className="faculty-details">
                <h4 className="faculty-name">{member.name}</h4>
                <p className="faculty-rank">{member.designation}</p>
                <span className="faculty-specialty">{member.specialization}</span>
                
                <div className="card-footer-link">
                  <Link to={`/faculty/${member.id}`} className="text-link">
                    View Profile <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}