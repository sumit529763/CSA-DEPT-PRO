// src/pages/News/News.jsx
import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './News.css';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

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
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop"
          },
          {
            _id: '2',
            title: "BCA Students Secure Top Positions in Smart India Hackathon",
            date: "2026-01-10",
            category: "Achievement",
            description: "Our 3rd-year students won the first prize in the fintech category at the national level hackathon held in Bangalore.",
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop"
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
        
        setTimeout(() => {
          setNewsList(mockNews);
          setLoading(false);
        }, 1200); // 1.2s delay to show the professional shimmer
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

      <div className="news-grid">
        {loading ? (
          // --- SKELETON LOADING STATE ---
          [1, 2, 3].map((n) => (
            <Card key={n} className="news-card skeleton-card">
              <div className="skeleton news-image-sk"></div>
              <div className="news-content">
                <div className="skeleton sk-text-short"></div> {/* Date placeholder */}
                <div className="skeleton sk-text"></div>       {/* Title line 1 */}
                <div className="skeleton sk-text"></div>       {/* Title line 2 */}
                <div className="skeleton sk-text"></div>       {/* Description line 1 */}
                <div className="skeleton sk-button"></div>     {/* Button placeholder */}
              </div>
            </Card>
          ))
        ) : newsList.length > 0 ? (
          // --- ACTUAL DATA STATE ---
          newsList.map((item) => (
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
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-newspaper"></i>
            <h3>No News Available</h3>
            <p>Check back later for fresh updates from the department.</p>
          </div>
        )}
      </div>
    </div>
  );
}