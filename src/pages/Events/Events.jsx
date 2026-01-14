// src/pages/Events/Events.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Future API call: const response = await api.get('/events');
    const fetchEvents = () => {
      const mockEvents = [
        {
          _id: 'e1',
          title: "Code-A-Thon 2026",
          date: "2026-02-20",
          time: "09:00 AM - 06:00 PM",
          venue: "Main Computing Lab, CSA Dept.",
          category: "Hackathon",
          description: "A 9-hour intensive coding challenge to solve real-world problems using MERN stack and AI.",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000",
          status: "Upcoming"
        },
        {
          _id: 'e2',
          title: "Seminar on Cyber Security Trends",
          date: "2026-01-30",
          time: "11:00 AM - 01:00 PM",
          venue: "Auditorium, GIET University",
          category: "Seminar",
          description: "Industry experts discuss the evolving landscape of cybersecurity and career opportunities.",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
          status: "Upcoming"
        },
        {
          _id: 'e3',
          title: "Workshop: React & Vite Modern Workflow",
          date: "2025-12-15",
          time: "10:00 AM - 04:00 PM",
          venue: "Seminar Hall 2",
          category: "Workshop",
          description: "Hands-on training session for 2nd year students on building high-performance web apps.",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
          status: "Past"
        }
      ];

      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 700);
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page container section-padding">
      <SectionTitle 
        title="Departmental Events" 
        subtitle="Experience innovation through our workshops, hackathons, and technical seminars" 
      />

      <div className="events-grid">
        {loading ? (
          <div className="loader">Loading Events...</div>
        ) : events.map((event) => (
          <Card key={event._id} className={`event-card ${event.status.toLowerCase()}`}>
            <div className="event-img-box">
              <img src={event.image} alt={event.title} />
              <span className="event-badge">{event.category}</span>
            </div>
            
            <div className="event-content">
              <div className="event-date-tag">
                <span className="ev-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="ev-day">{new Date(event.date).getDate()}</span>
              </div>
              
              <div className="event-main-info">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-desc">{event.description}</p>
                
                <div className="event-details-list">
                  <span><i className="far fa-clock"></i> {event.time}</span>
                  <span><i className="fas fa-map-marker-alt"></i> {event.venue}</span>
                </div>

                <button className={`btn-event ${event.status === 'Past' ? 'btn-disabled' : ''}`}>
                  {event.status === 'Past' ? 'View Highlights' : 'Register Now'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}