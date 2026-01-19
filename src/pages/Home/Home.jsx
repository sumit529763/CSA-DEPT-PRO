// src/pages/Home/Home.jsx

import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./Home.css";

// Images you confirmed exist in src/assets/images

import csagiet from "../../assets/images/csa-giet2.jpeg";
import csadept from "../../assets/images/csadept.jpeg";
import logo from "../../assets/images/logo.png";

// small inline SVG placeholder for any missing images

const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#eef4ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#3b5998' font-family='Arial' font-size='20'>Image not found</text></svg>`
  );

function safeSrc(src) {
  return src || PLACEHOLDER;
}

export default function Home() {
  return (
    <main>
      {/* HERO */}

      <section className="hero">
        <div className="container hero-layout">
          <div className="hero-image-wrapper">
            <div className="image-overlay" />

            <img
              src={safeSrc(csadept)}
              alt="CSA Department, GIET University"
              className="hero-image"
              onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            />
          </div>

          <div className="hero-about">
            <h2 className="section-heading">About the CSA Department</h2>

            <div className="hero-badges">
              <span className="badge">📚 BCA &amp; MCA Programs</span>

              <span className="badge">💻 Modern Computer Labs</span>

              <span className="badge">
                🏆 Technical Events &amp; Hackathons
              </span>
            </div>

            <p className="about-text">
              The Department of Computer Science and Application (CSA) at GIET
              University focuses on building strong foundations in computing,
              programming, and modern software development. It offers both
              undergraduate (BCA) and postgraduate (MCA) programmes aligned with
              current industry requirements.
            </p>

            <p className="about-text">
              With well-equipped computer laboratories, experienced faculty
              members, and a student-centric learning environment, the
              department encourages project-based learning, coding practices,
              and participation in technical events, hackathons, and workshops.
            </p>

            <ul className="about-list">
              <li>Modern computer labs and infrastructure.</li>

              <li>
                Curriculum focused on core CS and application development.
              </li>

              <li>Seminars, guest lectures, and technical events.</li>

              <li>Support for placements, internships, and higher studies.</li>
            </ul>

            <button
              className="btn-learn-more"
              onClick={() => (window.location.href = "/about")}
            >
              Know More →
            </button>
          </div>
        </div>
      </section>

      {/* COURSES */}

      <section className="courses">
        <div className="container">
          <h2 className="section-heading">Courses Offered</h2>

          <p className="section-subtitle">
            The CSA Department offers the following programmes:
          </p>

          <div className="courses-grid">
            <article className="course-card">
              <h3 className="course-title">
                Bachelor of Computer Application (BCA)
              </h3>

              <p className="course-tag">Undergraduate Programme · 3 Years</p>

              <p className="course-text">
                The BCA programme provides a strong base in computer
                fundamentals, programming, databases, operating systems, and web
                technologies to prepare students for careers in software and IT.
              </p>

              <ul className="course-details">
                <li>Eligibility: 10+2 (as per GIET University norms)</li>

                <li>
                  Focus: Programming, web development, DBMS, operating systems.
                </li>

                <li>
                  Career Paths: Software Developer, Web Developer, System
                  Analyst, IT Support.
                </li>
              </ul>

              <button className="btn-enquiry">Enquiry for BCA</button>
            </article>

            <article className="course-card">
              <h3 className="course-title">
                Master of Computer Application (MCA)
              </h3>

              <p className="course-tag">Postgraduate Programme · 2 Years</p>

              <p className="course-text">
                The MCA programme is designed for graduates aiming to specialize
                in software development, application design, and advanced
                computing concepts.
              </p>

              <ul className="course-details">
                <li>
                  Eligibility: Graduation with required background (GIET
                  University norms).
                </li>

                <li>
                  Focus: Advanced programming, software engineering, data
                  analytics, projects.
                </li>

                <li>
                  Career Paths: Software Engineer, Full-Stack Developer, Data
                  Analyst, Consultant.
                </li>
              </ul>

              <button className="btn-enquiry">Enquiry for MCA</button>
            </article>
          </div>
        </div>
      </section>

      {/* GALLERY */}

      <section className="gallery">
        <div className="container">
          <h2 className="section-heading">Gallery</h2>

          <p className="section-subtitle">
            Glimpses of CSA labs, events, and student activities.
          </p>

          <div className="gallery-grid">
            <div className="gallery-item">
              <img
                src={safeSrc(csagiet)}
                alt="CSA Lab"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />

              <span className="gallery-caption">Computer Lab</span>
            </div>

            <div className="gallery-item">
              <img
                src={safeSrc(logo)}
                alt="CSA Event"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />

              <span className="gallery-caption">
                Technical Events &amp; Workshops
              </span>
            </div>

            <div className="gallery-item">
              <img
                src={safeSrc(csadept)}
                alt="CSA Seminar"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />

              <span className="gallery-caption">
                Guest Lectures &amp; Seminars
              </span>
            </div>

            <div className="gallery-item">
              <img src={PLACEHOLDER} alt="Placeholder" />

              <span className="gallery-caption">
                Student Activities &amp; Projects
              </span>
            </div>
          </div>

          <div className="gallery-btn-wrapper">
            <NavLink to="/gallery" className="btn-view-more">
              View More →
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
}
