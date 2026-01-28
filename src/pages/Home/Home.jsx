// src/pages/Home/Home.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Home.css";

// Assets
import csadept from "../../assets/images/csadept.jpeg";
import csagiet from "../../assets/images/csa-giet2.jpeg";
import saLogo from "../../assets/images/logo.png"; // Student Association Logo

export default function Home() {
  return (
    <main className="home-page">
      {/* 🎬 VIDEO HERO SECTION */}
      <section className="hero-section">
        <div className="hero-video-wrapper">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src="https://www.giet.edu/wp-content/uploads/2021/03/main-banner-optimized.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="container hero-content">
          <div className="hero-text-box">
            {/* <span className="hero-tag">GIET University, Gunupur</span> */}
            <h1 className="hero-main-title">
              Department of <br /> 
              <span>Computer Science & Application</span>
            </h1>
            <p className="hero-lead">
              Innovating the future through world-class infrastructure and industry-aligned BCA & MCA programs.
            </p>
            <div className="hero-btn-group">
              <NavLink to="/about" className="btn-primary">Explore Department</NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ WHY CHOOSE SECTION (Professional Layout) */}
      <section className="about-overview section-padding">
        <div className="container about-grid">
          <div className="about-image-side">
            <div className="image-stack">
              <img src={csadept} alt="CSA Building" className="main-img" />
              <div className="experience-badge">
                <strong>25+</strong>
                <span>Years of Excellence</span>
              </div>
            </div>
          </div>
          <div className="about-content-side">
            <h2 className="section-heading">Why Choose CSA at GIETU?</h2>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-microchip"></i></div>
                <div className="feature-text">
                  <h4>Advanced Computing Labs</h4>
                  <p>Equipped with high-end GPUs and the latest software suites to facilitate Research in Deep Learning.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-users-cog"></i></div>
                <div className="feature-text">
                  <h4>Expert Faculty</h4>
                  <p>Mentors with deep research backgrounds and industry experience guiding the next generation of tech leaders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎓 ACADEMIC PROGRAMMES SECTION */}
      <section className="courses-overview section-padding bg-light">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-heading">Our Academic Programmes</h2>
            <p className="section-subtitle">Industry-aligned courses for future tech leaders</p>
          </div>
          <div className="courses-grid-enhanced">
            <div className="course-card-modern">
              <div className="course-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>BCA</h3>
              <p className="course-duration">3 Years Undergraduate</p>
              <p>Foundations of programming, web technologies, and database management.</p>
              <NavLink to="/exam" className="course-link">Course Details →</NavLink>
            </div>
            <div className="course-card-modern">
              <div className="course-icon"><i className="fas fa-laptop-code"></i></div>
              <h3>MCA</h3>
              <p className="course-duration">2 Years Postgraduate</p>
              <p>Advanced software engineering, data analytics, and AI specialization.</p>
              <NavLink to="/exam" className="course-link">Course Details →</NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* 🖼️ CAMPUS HIGHLIGHTS (Masonry Gallery) */}
      <section className="campus-highlights section-padding">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-heading">Campus Highlights</h2>
            <p className="section-subtitle">Glimpses of life at the CSA Department</p>
          </div>
          
          <div className="masonry-gallery">
            <div className="gal-item tall">
              <img src={csadept} alt="Main Building" />
              <div className="gal-overlay"><span>Campus Infrastructure</span></div>
            </div>
            <div className="gal-item">
              <img src={csagiet} alt="Lab View" />
              <div className="gal-overlay"><span>Modern Labs</span></div>
            </div>
            <div className="gal-item logo-box">
              <img src={saLogo} alt="CSA Association" className="sa-logo" />
            </div>
            <div className="gal-item wide">
              <img src={csadept} alt="Academic Excellence" />
              <div className="gal-overlay"><span>Academic Excellence</span></div>
            </div>
          </div>

          <div className="gallery-footer">
            <NavLink to="/gallery" className="view-full-btn">
              View Full Gallery <i className="fas fa-arrow-right"></i>
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
}