// src/pages/Alumni/Alumni.jsx
import React from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Alumini.css';

const alumniMembers = [
  {
    id: 1,
    name: "Rakesh Roshan",
    batch: "2018-2021",
    position: "Senior Software Engineer",
    company: "Google, Mountain View",
    image: "https://via.placeholder.com/150",
    quote: "The foundation I built at CSA Department was instrumental in my journey to Silicon Valley."
  },
  {
    id: 2,
    name: "Priyanka Sethi",
    batch: "2019-2022",
    position: "Data Scientist",
    company: "Amazon, Berlin",
    image: "https://via.placeholder.com/150",
    quote: "From lab sessions to hackathons, the department provided the perfect environment for growth."
  },
  {
    id: 3,
    name: "Vikram Aditya",
    batch: "2015-2018",
    position: "Full Stack Developer",
    company: "TCS, Mumbai",
    image: "https://via.placeholder.com/150",
    quote: "Proud to be an alumnus of GIET. The faculty support here is unparalleled."
  }
];

export default function Alumni() {
  return (
    <div className="alumni-page container section-padding">
      <SectionTitle 
        title="Our Alumni Network" 
        subtitle="Celebrating the global success of our graduates across the tech industry" 
      />

      {/* 🌍 Connection CTA */}
      <div className="alumni-banner">
        <div className="banner-content">
          <h3>Are you a CSA Graduate?</h3>
          <p>Join our growing network of 2000+ alumni worldwide and stay connected with your alma mater.</p>
          <button className="btn-join">Register as Alumni <i className="fas fa-external-link-alt"></i></button>
        </div>
      </div>

      {/* ⭐ Featured Alumni */}
      <div className="alumni-grid">
        {alumniMembers.map((alumnus) => (
          <Card key={alumnus.id} className="alumni-card">
            <div className="alumni-header">
              <img src={alumnus.image} alt={alumnus.name} className="alumni-img" />
              <div className="alumni-meta">
                <h4>{alumnus.name}</h4>
                <p className="alumni-batch">Class of {alumnus.batch}</p>
              </div>
            </div>
            <div className="alumni-body">
              <p className="alumni-pos"><strong>{alumnus.position}</strong></p>
              <p className="alumni-company">at {alumnus.company}</p>
              <p className="alumni-quote">"{alumnus.quote}"</p>
            </div>
            <div className="alumni-footer">
               <a href="#" className="linkedin-link"><i className="fab fa-linkedin"></i> Connect</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}