import React, { useState, useEffect } from 'react';
import './Achievements.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const CATEGORIES = ["All", "Academic", "Research", "Sports", "Cultural", "Technical", "Award", "Other"];

const CAT_ICONS = {
  Academic:  "fa-graduation-cap",
  Research:  "fa-flask",
  Sports:    "fa-trophy",
  Cultural:  "fa-music",
  Technical: "fa-code",
  Award:     "fa-award",
  Other:     "fa-star",
};

const CAT_COLORS = {
  Academic:  { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
  Research:  { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  Sports:    { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Cultural:  { bg: "#fdf2f8", color: "#be185d", border: "#fbcfe8" },
  Technical: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  Award:     { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Other:     { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
};

export default function Achievements() {
  const [years, setYears]             = useState([]);
  const [activeYear, setActiveYear]   = useState("all");
  const [activeCat, setActiveCat]     = useState("All");
  const [records, setRecords]         = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingRec, setLoadingRec]   = useState(false);
  const [expanded, setExpanded]       = useState(null);
  const [error, setError]             = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/achievements/years`)
      .then(r => r.json())
      .then(j => { setYears(j.data || []); })
      .catch(() => {})
      .finally(() => setLoadingYears(false));
  }, []);

  useEffect(() => {
    const fetchRec = async () => {
      try {
        setLoadingRec(true); setError(null);
        const params = new URLSearchParams();
        if (activeYear !== "all") params.set("year", activeYear);
        if (activeCat !== "All")  params.set("category", activeCat);
        const res  = await fetch(`${API_BASE}/api/achievements?${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setRecords(json.data);
        setExpanded(null);
      } catch (e) { setError(e.message); }
      finally { setLoadingRec(false); }
    };
    fetchRec();
  }, [activeYear, activeCat]);

  const highlights = records.filter(r => r.isHighlight);
  const rest       = records.filter(r => !r.isHighlight);

  return (
    <div className="ach-page">

      {/* ── HERO ── */}
      <div className="ach-hero">
        <div className="ach-hero-bg">
          <div className="ach-hb ach-hb-1"></div>
          <div className="ach-hb ach-hb-2"></div>
          <div className="ach-hb ach-hb-3"></div>
        </div>
        <div className="ach-hero-grid">
          {["🏆","🥇","🎓","🔬","🏅","💻","🎖️","⭐"].map((e,i)=>(
            <span key={i} className="ach-hero-emoji" style={{ animationDelay:`${i*0.3}s` }}>{e}</span>
          ))}
        </div>
        <div className="container ach-hero-content">
          <span className="ach-eyebrow">CSA Department · GIET University</span>
          <h1 className="ach-hero-title">Student <em>Achievements</em></h1>
          <p className="ach-hero-sub">Celebrating the excellence, innovation and dedication of our students across all domains</p>
          {!loadingYears && records.length > 0 && (
            <div className="ach-hero-count">
              <span><strong>{records.length}</strong> achievements found</span>
            </div>
          )}
        </div>
      </div>

      <div className="container ach-body">

        {/* ── YEAR + CATEGORY FILTERS ── */}
        <div className="ach-filters-wrap">

          {/* Year tabs */}
          <div className="ach-filter-row">
            <span className="ach-filter-label"><i className="fas fa-calendar"></i> Year</span>
            <div className="ach-year-tabs">
              <button className={`ach-year-tab ${activeYear === "all" ? "active" : ""}`} onClick={() => setActiveYear("all")}>
                All Years
              </button>
              {loadingYears ? (
                [1,2,3].map(n => <div key={n} className="skeleton ach-tab-sk"></div>)
              ) : (
                years.map(y => (
                  <button key={y} className={`ach-year-tab ${activeYear === y ? "active" : ""}`} onClick={() => setActiveYear(y)}>
                    {y}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="ach-filter-row">
            <span className="ach-filter-label"><i className="fas fa-tag"></i> Category</span>
            <div className="ach-cat-tabs">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`ach-cat-tab ${activeCat === c ? "active" : ""}`}
                  onClick={() => setActiveCat(c)}
                >
                  {c !== "All" && <i className={`fas ${CAT_ICONS[c]}`}></i>}
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="ach-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}

        {/* ── HIGHLIGHTS ── */}
        {!loadingRec && highlights.length > 0 && (
          <section className="ach-hl-section">
            <div className="ach-section-head">
              <span className="ach-hl-pill"><i className="fas fa-crown"></i> Top Achievements</span>
            </div>
            <div className="ach-hl-grid">
              {highlights.map((r, i) => (
                <AchCard key={r._id} r={r} highlight idx={i}
                  expanded={expanded === r._id}
                  onToggle={() => setExpanded(expanded === r._id ? null : r._id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── ALL RECORDS ── */}
        <section className="ach-all-section">
          {highlights.length > 0 && rest.length > 0 && (
            <div className="ach-section-divider">
              <span>More Achievements</span>
            </div>
          )}

          {loadingRec ? (
            <div className="ach-grid">
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="ach-card skeleton-card">
                  <div className="skeleton ach-sk-img"></div>
                  <div className="ach-sk-body">
                    <div className="skeleton ach-sk-ln"></div>
                    <div className="skeleton ach-sk-ln ach-sk-s"></div>
                    <div className="skeleton ach-sk-ln ach-sk-xs"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : rest.length === 0 && highlights.length === 0 ? (
            <div className="ach-empty">
              <div className="ach-empty-icon">🏅</div>
              <h3>No achievements found</h3>
              <p>Try changing the year or category filter.</p>
            </div>
          ) : rest.length > 0 ? (
            <div className="ach-grid">
              {rest.map((r, i) => (
                <AchCard key={r._id} r={r} idx={i}
                  expanded={expanded === r._id}
                  onToggle={() => setExpanded(expanded === r._id ? null : r._id)}
                />
              ))}
            </div>
          ) : null}
        </section>

      </div>
    </div>
  );
}

function AchCard({ r, highlight, idx, expanded, onToggle }) {
  const cat   = CAT_COLORS[r.category] || CAT_COLORS.Other;
  const icon  = CAT_ICONS[r.category]  || "fa-star";

  return (
    <div
      className={`ach-card ${highlight ? "ach-card-hl" : ""} ${expanded ? "ach-card-open" : ""}`}
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      {highlight && <div className="ach-crown-badge"><i className="fas fa-crown"></i></div>}

      {/* Image or icon header */}
      {r.image ? (
        <div className="ach-img-wrap">
          <img src={r.image} alt={r.title}
            onError={e => { e.target.parentElement.style.display='none'; }} />
          <div className="ach-img-overlay">
            <span className="ach-cat-chip" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
              <i className={`fas ${icon}`}></i> {r.category}
            </span>
          </div>
        </div>
      ) : (
        <div className="ach-icon-header" style={{ background: `linear-gradient(135deg, ${cat.bg}, white)` }}>
          <div className="ach-icon-circle" style={{ background: cat.bg, color: cat.color, border: `2px solid ${cat.border}` }}>
            <i className={`fas ${icon}`}></i>
          </div>
          <span className="ach-cat-chip" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
            <i className={`fas ${icon}`}></i> {r.category}
          </span>
        </div>
      )}

      <div className="ach-card-body">
        <div className="ach-meta-row">
          <span className="ach-year-chip">{r.year}</span>
          {r.studentName && <span className="ach-student"><i className="fas fa-user"></i> {r.studentName}</span>}
        </div>

        <h3 className="ach-title">{r.title}</h3>

        <p className={`ach-desc ${expanded ? "expanded" : ""}`}>{r.description}</p>

        {r.description.length > 120 && (
          <button className="ach-read-more" onClick={onToggle}>
            {expanded ? "Show less" : "Read more"} <i className={`fas fa-chevron-${expanded ? "up" : "down"}`}></i>
          </button>
        )}
      </div>
    </div>
  );
}