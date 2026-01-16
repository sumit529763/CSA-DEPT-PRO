// src/pages/News/News.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './News.css';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to simulate or fetch news from your future MongoDB API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const mockNews = [
          {
            _id: '1',
            title: "National Conference on AI and Machine Learning 2026",
            date: "2026-02-15",
            category: "Event",
            description: "The CSA Department is proud to host the upcoming national conference featuring industry experts from Google and Microsoft.",
            image: "https://images.unsplash.com/photo-1591115765373-520b7a217294?q=80&w=1000&auto=format&fit=crop"
          },
          {
            _id: '2',
            title: "BCA Students Secure Top Positions in Smart India Hackathon",
            date: "2026-01-10",
            category: "Achievement",
            description: "Our 3rd-year students won the first prize in the fintech category at the national level hackathon held in Bangalore.",
            image: "https://images.unsplash.com/photo-1523240715639-99a8088fb9a9?q=80&w=1000&auto=format&fit=crop"
          },
          {
            _id: '3',
            title: "New Advanced Computing Lab Inaugurated",
            date: "2025-12-20",
            category: "Infrastructure",
            description: "The department has added 60 high-end systems equipped with the latest GPUs to facilitate Research in Deep Learning.",
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop"
          }
        ];
        
        // Simulating a network delay for professional feel
        setTimeout(() => {
          setNewsList(mockNews);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-page-container container section-padding">
      <SectionTitle 
        title="Department News" 
        subtitle="Stay updated with the latest happenings in the CSA Department" 
      />

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading latest updates...</p>
        </div>
      ) : newsList.length > 0 ? (
        <div className="news-grid">
          {newsList.map((item) => (
            <Card key={item._id} className="news-card">
              <div className="news-image-wrapper">
                <img src={item.image} alt={item.title} className="news-image" />
                <span className="news-category-badge">{item.category}</span>
              </div>
              <div className="news-content">
                <span className="news-date">
                  <i className="far fa-calendar-alt"></i> {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-description">{item.description}</p>
                <button className="news-read-more">
                  Read Full Story <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-newspaper-o"></i>
          <h3>No News Available</h3>
          <p>Check back later for fresh updates from the department.</p>
        </div>
      )}
    </div>
  );
}