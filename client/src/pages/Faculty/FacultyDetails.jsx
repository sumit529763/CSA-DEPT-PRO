import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import hodpic from '../../assets/images/hod-pic.jpeg'; // Ensure this path is correct
import './Faculty.css';

export default function FacultyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    // Full data structure preserved exactly as discussed
    const facultyData = [
      {
        id: "satya-narayan-das",
        name: "Prof. Satya Narayan Das",
        designation: "Head of Department",
        qualification: "Ph.D. in Computer Science",
        specialization: "Artificial Intelligence & Soft Computing",
        email: "hod.csa@giet.edu",
        image: hodpic,
        bio: "Dr. Satya Narayan Das has over 15 years of experience in academia and research. His primary focus lies in neural networks and ethical AI development. He has published over 40 research papers in international journals and is a senior member of the CSA department at GIET University.",
        expertise: ["Artificial Intelligence", "Neural Networks", "Soft Computing", "Machine Learning"],
        scholarUrl: "https://scholar.google.com/citations?user=bZcJlw4AAAAJ"
      },
      {
        id: "soumya-ranjan-mishra",
        name: "Ms. Soumya Ranjan Mishra",
        designation: "Assistant Professor",
        qualification: "M.Tech in CSE",
        specialization: "Database Management & SQL",
        email: "soumyaranjan@giet.edu",
        image: hodpic,
        bio: "Ms. Soumya specializes in database architecture and SQL optimization. She has been instrumental in developing the database curriculum for the BCA program.",
        expertise: ["DBMS", "SQL Optimization", "Data Modeling"],
        scholarUrl: "https://scholar.google.com"
      }
    ];

    const found = facultyData.find(f => f.id === id);
    setMember(found);
    window.scrollTo(0, 0); 
  }, [id]);

  if (!member) {
    return (
      <div className="container section-padding">
        <h2 style={{textAlign: 'center', marginTop: '50px'}}>Faculty profile not found.</h2>
        <button className="btn-back" onClick={() => navigate('/faculty')} style={{margin: '20px auto', display: 'block'}}>
           Return to Faculty List
        </button>
      </div>
    );
  }

  return (
    <div className="faculty-details-wrapper">
      <div className="container profile-container">
        {/* Navigation / Breadcrumb */}
        <nav className="profile-nav">
          <button className="btn-back" onClick={() => navigate('/faculty')}>
            <i className="fas fa-arrow-left"></i> Back to Faculty
          </button>
        </nav>

        <div className="profile-main-card">
          {/* Left Side: Image and Quick Contact Chips */}
          <div className="profile-sidebar">
            <div className="profile-image-frame">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="profile-quick-links">
              <a href={`mailto:${member.email}`} className="social-link-item">
                <i className="fas fa-envelope"></i> 
                <span>Email Member</span>
              </a>
              <a href={member.scholarUrl} target="_blank" rel="noreferrer" className="social-link-item scholar-link">
                <i className="fas fa-graduation-cap"></i> 
                <span>Scholar Profile</span>
              </a>
            </div>
          </div>

          {/* Right Side: Detailed Biography and Skills */}
          <div className="profile-content">
            <header className="profile-header-info">
              <span className="designation-badge">{member.designation}</span>
              <h1 className="faculty-full-name">{member.name}</h1>
              <p className="academic-degree"><strong>{member.qualification}</strong></p>
            </header>

            <section className="profile-section">
              <h3><i className="fas fa-user-tie"></i> Biography</h3>
              <p className="bio-text">{member.bio}</p>
            </section>

            <section className="profile-section">
              <h3><i className="fas fa-lightbulb"></i> Research Expertise</h3>
              <div className="expertise-tags">
                {member.expertise.map((item, index) => (
                  <span key={index} className="expertise-tag">{item}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}