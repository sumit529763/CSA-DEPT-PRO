import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionTitle from '../../components/UI/SectionTitle'; // Ensure this path is correct!
import './Gallery.css';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/gallery`;
        const res = await axios.get(API_URL);
        setImages(res.data.data || []);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  const categories = ['All', 'Infrastructure', 'Events', 'Academic'];

  return (
    <div className="gallery-page container section-padding">
      <SectionTitle 
        title="Campus Gallery" 
        subtitle="Vibrant life and facilities of the CSA Department" 
      />

      <div className="gallery-filter-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
            disabled={loading}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="gallery-item skeleton-item">
              <div className="skeleton sk-gallery-img"></div>
            </div>
          ))
        ) : filteredImages.length === 0 ? (
          <div className="no-data" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px', color: '#6b7280' }}>
            No images found for this category.
          </div>
        ) : (
          filteredImages.map((image) => (
            <div key={image._id} className="gallery-item">
              <div className="gallery-img-container">
                {/* Fallback added here to ensure Cloudinary links don't break */}
                <img src={image.image || image.imageUrl || image.url} alt={image.caption} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="gallery-cat-label">{image.category}</span>
                  <h4 className="gallery-img-title">{image.caption}</h4>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}