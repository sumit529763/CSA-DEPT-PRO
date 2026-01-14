// src/pages/Placements/Placements.jsx
import React from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Placement.css';

const placementStats = [
  { label: "Placement %", value: "92%" },
  { label: "Highest Package", value: "12 LPA" },
  { label: "Average Package", value: "4.5 LPA" },
  { label: "Recruiters", value: "150+" }
];

const recruiters = [
  { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Wipro_Logo.svg" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
  { name: "Capgemini", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg" },
  { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Tech_Mahindra_new_logo.svg" }
];

export default function Placements() {
  return (
    <div className="placements-page container section-padding">
      <SectionTitle 
        title="Placement Excellence" 
        subtitle="Empowering our students to build careers with global tech leaders" 
      />

      {/* 📊 High-Impact Stats */}
      <div className="stats-grid">
        {placementStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h2 className="stat-value">{stat.value}</h2>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 🏢 Top Recruiters Section */}
      <div className="recruiters-section">
        <h3 className="sub-heading">Our Top Recruiters</h3>
        <div className="logo-grid">
          {recruiters.map((company, index) => (
            <div key={index} className="logo-item" title={company.name}>
              <img src={company.logo} alt={company.name} />
            </div>
          ))}
        </div>
      </div>

      {/* 🎓 Placement Highlights */}
      <div className="highlights-section">
        <h3 className="sub-heading">Student Success Highlights</h3>
        <div className="highlights-grid">
          <Card className="highlight-card">
            <div className="student-profile">
              <div className="student-img-placeholder">SM</div>
              <div>
                <h4>Sumit Mohanty</h4>
                <p>Placed at: <strong>Accenture</strong></p>
              </div>
            </div>
            <p className="testimonial">"The CSA department's focus on practical coding and regular mock interviews helped me crack the technical rounds easily."</p>
          </Card>
          
          <Card className="highlight-card">
            <div className="student-profile">
              <div className="student-img-placeholder">AD</div>
              <div>
                <h4>Ananya Dash</h4>
                <p>Placed at: <strong>Infosys</strong></p>
              </div>
            </div>
            <p className="testimonial">"The supportive faculty and the advanced computing labs at GIET gave me the edge I needed for my career."</p>
          </Card>

          <Card className="highlight-card">
            <div className="student-profile">
              <div className="student-img-placeholder">SM</div>
              <div>
                <h4>Sumit Mohanty</h4>
                <p>Placed at: <strong>Accenture</strong></p>
              </div>
            </div>
            <p className="testimonial">"The CSA department's focus on practical coding and regular mock interviews helped me crack the technical rounds easily."</p>
          </Card>

          <Card className="highlight-card">
            <div className="student-profile">
              <div className="student-img-placeholder">SM</div>
              <div>
                <h4>Sumit Mohanty</h4>
                <p>Placed at: <strong>Accenture</strong></p>
              </div>
            </div>
            <p className="testimonial">"The CSA department's focus on practical coding and regular mock interviews helped me crack the technical rounds easily."</p>
          </Card>


          <Card className="highlight-card">
            <div className="student-profile">
              <div className="student-img-placeholder">SM</div>
              <div>
                <h4>Sumit Mohanty</h4>
                <p>Placed at: <strong>Accenture</strong></p>
              </div>
            </div>
            <p className="testimonial">"The CSA department's focus on practical coding and regular mock interviews helped me crack the technical rounds easily."</p>
          </Card>
        </div>
      </div>
    </div>
  );
}