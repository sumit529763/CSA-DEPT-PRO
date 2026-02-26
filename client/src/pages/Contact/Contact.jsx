// src/pages/Contact/Contact.jsx
import React, { useState } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you! Your message has been sent to the CSA Department.");
  };

  return (
    <div className="contact-page container section-padding">
      <SectionTitle 
        title="Get In Touch" 
        subtitle="Have questions? Reach out to the Department of Computer Science & Application" 
      />

      <div className="contact-wrapper">
        {/* 📍 Contact Information & Map */}
        <div className="contact-info-panel">
          <div className="info-item">
            <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
            <div className="text-box">
              <h4>Location</h4>
              <p>GIET University, Gunupur, Odisha - 765022</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><i className="fas fa-envelope"></i></div>
            <div className="text-box">
              <h4>Email Us</h4>
              <p>csa@giet.edu</p>
              <p>hod.csa@giet.edu</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><i className="fas fa-phone-alt"></i></div>
            <div className="text-box">
              <h4>Call Us</h4>
              <p>+91-XXXX-XXXXXX (Office)</p>
              <p>+91-XXXX-XXXXXX (Admissions)</p>
            </div>
          </div>

          {/* Placeholder for Google Map */}
          <div className="map-container">
            <iframe 
              title="GIET University Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.155828551139!2d83.81881537522506!3d19.06782255219468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2335f639943545%3A0xc31464733e8a3424!2sGIET%20University!5e0!3m2!1sen!2sin!4v1705260000000!5m2!1sen!2sin" 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* ✉️ Contact Form */}
        <div className="contact-form-panel">
          <form className="professional-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                placeholder="Admission Inquiry / Placement" 
                required 
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="How can we help you?" 
                required
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn-send">
              Send Message <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}