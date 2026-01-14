// src/pages/Gallery/Gallery.jsx
import React, { useState } from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import './Gallery.css';

const galleryImages = [
  { id: 1, category: 'Infrastructure', title: 'Advanced AI Lab', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000' },
  { id: 2, category: 'Events', title: 'Tech Fest 2025', url: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?q=80&w=1000' },
  { id: 3, category: 'Academic', title: 'Coding Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000' },
  { id: 4, category: 'Infrastructure', title: 'Department Library', url: 'https://images.unsplash.com/photo-1507733632300-47866b0f2c41?q=80&w=1000' },
  { id: 5, category: 'Events', title: 'Annual Seminar', url: 'https://images.unsplash.com/photo-1475721027187-402ad2989a3b?q=80&w=1000' },
  { id: 6, category: 'Academic', title: 'Project Exhibition', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const categories = ['All', 'Infrastructure', 'Events', 'Academic'];

  return (
    <div className="gallery-page container section-padding">
      <SectionTitle 
        title="Campus Gallery" 
        subtitle="Exploring the vibrant life and world-class facilities of the CSA Department" 
      />

      {/* Filter Bar */}
      <div className="gallery-filter-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredImages.map((image) => (
          <div key={image.id} className="gallery-item">
            <div className="gallery-img-container">
              <img src={image.url} alt={image.title} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-cat-label">{image.category}</span>
                <h4 className="gallery-img-title">{image.title}</h4>
                <button className="gallery-zoom-icon">
                  <i className="fas fa-search-plus"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}