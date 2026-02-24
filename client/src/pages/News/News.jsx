// src/pages/News/News.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SectionTitle from "../../components/UI/SectionTitle";
import Card from "../../components/UI/Card";
import "./News.css";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news`);

        // backend response → { success, count, data }
        setNewsList(res.data.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
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
                <div className="skeleton sk-text-short"></div>
                <div className="skeleton sk-text"></div>
                <div className="skeleton sk-text"></div>
                <div className="skeleton sk-text"></div>
                <div className="skeleton sk-button"></div>
              </div>
            </Card>
          ))
        ) : newsList.length > 0 ? (
          // --- ACTUAL DATA STATE ---
          newsList.map((item) => (
            <Card key={item._id} className="news-card">
              <div className="news-image-wrapper">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="news-image"
                  />
                )}

                {/* optional badge (static or dynamic later) */}
                <span className="news-category-badge">
                  Department
                </span>
              </div>

              <div className="news-content">
                <span className="news-date">
                  <i className="far fa-calendar-alt"></i>{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <h3 className="news-title">{item.title}</h3>

                <p className="news-description">
                  {item.description}
                </p>

                <button className="news-read-more">
                  Read Full Story <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </Card>
          ))
        ) : (
          // --- EMPTY STATE ---
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
