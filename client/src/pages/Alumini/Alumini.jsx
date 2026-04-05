import React, { useState, useEffect } from 'react';
import './Alumini.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Alumni() {
  const [years, setYears]           = useState([]);
  const [activeYear, setActiveYear] = useState("all");
  const [records, setRecords]       = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingRec, setLoadingRec]     = useState(false);
  const [error, setError]           = useState(null);

  // Fetch passout years
  useEffect(() => {
    fetch(`${API_BASE}/api/alumni/years`)
      .then(r => r.json())
      .then(j => setYears(j.data || []))
      .catch(() => {})
      .finally(() => setLoadingYears(false));
  }, []);

  // Fetch alumni by year
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoadingRec(true); setError(null);
        const url = activeYear === "all"
          ? `${API_BASE}/api/alumni`
          : `${API_BASE}/api/alumni?year=${encodeURIComponent(activeYear)}`;
        const res  = await fetch(url);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setRecords(json.data);
      } catch (e) { setError(e.message); }
      finally { setLoadingRec(false); }
    };
    fetchRecords();
  }, [activeYear]);

  const highlights = records.filter(r => r.isHighlight);
  const rest       = records.filter(r => !r.isHighlight);

  return (
    <div className="al-page">

      {/* ── HERO ── */}
      <div className="al-hero">
        <div className="al-hero-bg">
          <div className="al-hb al-hb-1"></div>
          <div className="al-hb al-hb-2"></div>
          <div className="al-hb al-hb-3"></div>
        </div>
        <div className="al-hero-pattern"></div>
        <div className="container al-hero-content">
          <span className="al-eyebrow">CSA Department · GIET University</span>
          <h1 className="al-hero-title">Our <em>Alumni</em> Network</h1>
          <p className="al-hero-sub">
            Celebrating the global success of our graduates who are building careers at the world's top companies
          </p>
          <div className="al-hero-stats">
            <div className="al-hstat">
              <strong>2000+</strong>
              <span>Alumni Worldwide</span>
            </div>
            <div className="al-hstat-div"></div>
            <div className="al-hstat">
              <strong>150+</strong>
              <span>Companies</span>
            </div>
            <div className="al-hstat-div"></div>
            <div className="al-hstat">
              <strong>20+</strong>
              <span>Countries</span>
            </div>
          </div>
        </div>

        {/* CTA banner inside hero */}
        <div className="al-cta-strip">
          <div className="container al-cta-inner">
            <div>
              <strong>Are you a CSA Graduate?</strong>
              <span>Join our growing alumni network and stay connected with your alma mater.</span>
            </div>
            <a href="/contact" className="al-cta-btn">
              <i className="fas fa-paper-plane"></i> Connect With Us
            </a>
          </div>
        </div>
      </div>

      <div className="container al-body">

        {/* ── YEAR FILTER ── */}
        <div className="al-filter-wrap">
          <div className="al-filter-head">
            <div className="al-fh-bar"></div>
            <div>
              <h2 className="al-fh-title">Browse by Batch</h2>
              <p className="al-fh-sub">Select a passout year to view alumni from that batch</p>
            </div>
          </div>

          <div className="al-year-tabs">
            <button
              className={`al-year-tab ${activeYear === "all" ? "active" : ""}`}
              onClick={() => setActiveYear("all")}
            >
              <i className="fas fa-users"></i> All Batches
            </button>
            {loadingYears
              ? [1,2,3].map(n => <div key={n} className="skeleton al-tab-sk"></div>)
              : years.map(y => (
                  <button
                    key={y}
                    className={`al-year-tab ${activeYear === y ? "active" : ""}`}
                    onClick={() => setActiveYear(y)}
                  >
                    <i className="fas fa-graduation-cap"></i> {y}
                  </button>
                ))
            }
          </div>
        </div>

        {error && (
          <div className="al-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>
        )}

        {/* ── RESULTS HEADING ── */}
        {!loadingRec && records.length > 0 && (
          <div className="al-results-head">
            <h3>
              {activeYear === "all" ? "All Alumni" : `Batch of ${activeYear}`}
            </h3>
            <span className="al-count-pill">{records.length} member{records.length !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* ── HIGHLIGHTS ── */}
        {!loadingRec && highlights.length > 0 && (
          <section className="al-hl-section">
            <div className="al-hl-label">
              <i className="fas fa-star"></i> Featured Alumni
            </div>
            <div className="al-hl-grid">
              {highlights.map((r, i) => (
                <AlumniCard key={r._id} r={r} highlight idx={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── GRID ── */}
        <section className="al-grid-section">
          {highlights.length > 0 && rest.length > 0 && (
            <div className="al-divider"><span>More Alumni</span></div>
          )}

          {loadingRec ? (
            <div className="al-grid">
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="al-card skeleton-card">
                  <div className="skeleton al-sk-avatar"></div>
                  <div className="al-sk-body">
                    <div className="skeleton al-sk-ln"></div>
                    <div className="skeleton al-sk-ln al-sk-s"></div>
                    <div className="skeleton al-sk-ln al-sk-xs"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : rest.length === 0 && highlights.length === 0 ? (
            <div className="al-empty">
              <div className="al-empty-icon">🎓</div>
              <h3>No alumni records found</h3>
              <p>{activeYear !== "all" ? `No records for ${activeYear} yet.` : "No alumni added yet."}</p>
            </div>
          ) : rest.length > 0 ? (
            <div className="al-grid">
              {rest.map((r, i) => (
                <AlumniCard key={r._id} r={r} idx={i} />
              ))}
            </div>
          ) : null}
        </section>

      </div>
    </div>
  );
}

function AlumniCard({ r, highlight, idx }) {
  return (
    <div
      className={`al-card ${highlight ? "al-card-hl" : ""}`}
      style={{ animationDelay: `${idx * 0.06}s` }}
    >
      {highlight && (
        <div className="al-star-badge"><i className="fas fa-star"></i></div>
      )}

      <div className="al-card-top">
        <div className={`al-avatar ${highlight ? "al-avatar-hl" : ""}`}>
          {r.photo
            ? <img src={r.photo} alt={r.name} onError={e => { e.target.style.display = "none"; }} />
            : <span>{getInitials(r.name)}</span>
          }
        </div>
        <div className="al-batch-tag">Batch {r.batch}</div>
      </div>

      <div className="al-card-body">
        <h3 className="al-name">{r.name}</h3>

        {r.position && (
          <p className="al-position">{r.position}</p>
        )}

        {r.company && (
          <div className="al-company-row">
            <i className="fas fa-building"></i>
            <span>{r.company}</span>
          </div>
        )}

        {r.location && (
          <div className="al-location-row">
            <i className="fas fa-map-marker-alt"></i>
            <span>{r.location}</span>
          </div>
        )}

        {r.quote && (
          <p className="al-quote">"{r.quote}"</p>
        )}
      </div>

      {r.linkedinUrl && (
        <div className="al-card-footer">
          <a href={r.linkedinUrl} target="_blank" rel="noreferrer" className="al-linkedin-btn">
            <i className="fab fa-linkedin"></i> Connect on LinkedIn
          </a>
        </div>
      )}
    </div>
  );
}