import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import hodpic from '../../assets/images/hod-pic.jpeg'; // Default import
import './Faculty.css';

export default function FacultyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    // This array should ideally come from a central data file or MongoDB
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
    window.scrollTo(0, 0); // Scroll to top when page opens
  }, [id]);

  if (!member) return <div className="container section-padding"><h2>Faculty profile not found.</h2></div>;

  return (
    <div className="faculty-details-page container section-padding">
      <button className="back-btn" onClick={() => navigate('/faculty')}>
        <i className="fas fa-arrow-left"></i> Back to Faculty
      </button>
      
      <div className="profile-header">
        <div className="profile-img-container">
          <img src={member.image} alt={member.name} />
        </div>
        <div className="profile-main-info">
          <span className="hod-badge">{member.designation}</span>
          <h1>{member.name}</h1>
          <p className="p-qualification"><strong>{member.qualification}</strong></p>
          <div className="p-contact-row">
            <a href={`mailto:${member.email}`} className="contact-link">
              <i className="fas fa-envelope"></i> {member.email}
            </a>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-card">
          <h3><i className="fas fa-user-tie"></i> Biography</h3>
          <p>{member.bio}</p>
        </div>

        <div className="profile-card">
          <h3><i className="fas fa-lightbulb"></i> Expertise</h3>
          <ul className="spec-list">
            {member.expertise.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="scholar-section-box">
        <h3>Research & Publications</h3>
        <p>For a detailed list of research papers and citation metrics, visit the official profile.</p>
        <a href={member.scholarUrl} target="_blank" rel="noreferrer" className="scholar-btn-large">
          <i className="fas fa-graduation-cap"></i> View Google Scholar Profile
        </a>
      </div>
    </div>
  );
}