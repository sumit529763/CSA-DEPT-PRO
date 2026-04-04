import React, { useState, useEffect } from "react";
import "./Placement.css";

const API = import.meta.env.VITE_API_BASE_URL;

const COMPANY_COLORS = [
  "#4285F4","#EA4335","#0A66C2","#F25022",
  "#7FBA00","#00A4EF","#FF6900","#1DB954",
];

function CompanyLogo({ logo, company, size = 48 }) {
  const color = COMPANY_COLORS[
    company.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % COMPANY_COLORS.length
  ];
  if (logo) return <img src={logo} alt={company} className="pl-company-logo-img" style={{ width: size, height: size }} />;
  return (
    <div className="pl-company-initial" style={{ width: size, height: size, background: color }}>
      {company.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Placement() {
  const [placements, setPlacements] = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterType, setFilterType]   = useState("All");
  const [batches, setBatches]         = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [plRes, stRes] = await Promise.all([
          fetch(`${API}/api/placements`),
          fetch(`${API}/api/placements/stats`),
        ]);
        const plJson = await plRes.json();
        const stJson = await stRes.json();
        if (!plJson.success) throw new Error(plJson.message);
        setPlacements(plJson.data);
        setStats(stJson.data);
        const uniqueBatches = [...new Set(plJson.data.map(p => p.batch))].sort().reverse();
        setBatches(uniqueBatches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = placements.filter(p => {
    const batchOk = filterBatch === "All" || p.batch === filterBatch;
    const typeOk  = filterType  === "All" || p.type  === filterType;
    return batchOk && typeOk;
  });

  const featured = filtered.filter(p => p.isFeatured);
  const rest     = filtered.filter(p => !p.isFeatured);

  return (
    <div className="pl-page">

      {/* HERO */}
      <div className="pl-hero">
        <div className="pl-hero-shapes">
          <div className="pl-hs pl-hs1" /><div className="pl-hs pl-hs2" /><div className="pl-hs pl-hs3" />
        </div>
        <div className="pl-hero-inner container">
          <span className="pl-eyebrow">Department of Computer Science &amp; Applications</span>
          <h1 className="pl-hero-title">Placement <em>Success</em> Stories</h1>
          <p className="pl-hero-sub">
            Our students consistently land roles at top companies across India and beyond.
          </p>

          {/* Stats bar */}
          {stats && (
            <div className="pl-stats-bar">
              <div className="pl-stat-item">
                <span className="pl-stat-num">{stats.total}+</span>
                <span className="pl-stat-label">Students Placed</span>
              </div>
              <div className="pl-stat-divider" />
              <div className="pl-stat-item">
                <span className="pl-stat-num">{stats.companies}+</span>
                <span className="pl-stat-label">Companies</span>
              </div>
              <div className="pl-stat-divider" />
              <div className="pl-stat-item">
                <span className="pl-stat-num">{stats.batches}</span>
                <span className="pl-stat-label">Batches</span>
              </div>
              <div className="pl-stat-divider" />
              <div className="pl-stat-item">
                <span className="pl-stat-num">{stats.internships}</span>
                <span className="pl-stat-label">Internships</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container pl-body">

        {error && <div className="pl-error">⚠️ {error}</div>}

        {/* FILTERS */}
        <div className="pl-filters">
          <div className="pl-filter-group">
            <span className="pl-filter-label">Batch</span>
            <div className="pl-filter-pills">
              {["All", ...batches].map(b => (
                <button
                  key={b}
                  className={`pl-pill ${filterBatch === b ? "active" : ""}`}
                  onClick={() => setFilterBatch(b)}
                >{b}</button>
              ))}
            </div>
          </div>
          <div className="pl-filter-group">
            <span className="pl-filter-label">Type</span>
            <div className="pl-filter-pills">
              {["All", "Full-Time", "Internship"].map(t => (
                <button
                  key={t}
                  className={`pl-pill ${filterType === t ? "active" : ""}`}
                  onClick={() => setFilterType(t)}
                >{t}</button>
              ))}
            </div>
          </div>
          <span className="pl-result-count">
            {loading ? "Loading..." : `${filtered.length} student${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* FEATURED */}
        {!loading && featured.length > 0 && (
          <section className="pl-section">
            <div className="pl-section-head">
              <div className="pl-section-accent" />
              <div>
                <h2 className="pl-section-title">Featured Placements</h2>
                <p className="pl-section-sub">Highlighted success stories from our department</p>
              </div>
            </div>
            <div className="pl-featured-grid">
              {featured.map((p, i) => (
                <FeaturedCard key={p._id} p={p} idx={i} />
              ))}
            </div>
          </section>
        )}

        {/* ALL PLACEMENTS */}
        <section className="pl-section">
          {featured.length > 0 && (
            <div className="pl-section-head">
              <div className="pl-section-accent" />
              <div>
                <h2 className="pl-section-title">All Placements</h2>
                <p className="pl-section-sub">Every student who made us proud</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="pl-card-grid">
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="pl-card pl-skeleton-card">
                  <div className="skeleton pl-sk-photo" />
                  <div className="pl-sk-body">
                    <div className="skeleton pl-sk-line" />
                    <div className="skeleton pl-sk-line pl-sk-short" />
                    <div className="skeleton pl-sk-line pl-sk-xshort" />
                  </div>
                </div>
              ))}
            </div>
          ) : rest.length === 0 && featured.length === 0 ? (
            <div className="pl-empty">
              <span className="pl-empty-icon">🎓</span>
              <p>No placement records found for the selected filters.</p>
            </div>
          ) : (
            <div className="pl-card-grid">
              {rest.map((p, i) => (
                <PlacementCard key={p._id} p={p} idx={i} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

function FeaturedCard({ p, idx }) {
  return (
    <div className="pl-featured-card" style={{ animationDelay: `${idx * 0.1}s` }}>
      <div className="pl-fc-left">
        <div className="pl-fc-photo">
          {p.photo
            ? <img src={p.photo} alt={p.studentName} />
            : <span>{p.studentName.charAt(0)}</span>
          }
        </div>
        <div className="pl-fc-badge">{p.type}</div>
      </div>
      <div className="pl-fc-body">
        <div className="pl-fc-company-row">
          <CompanyLogo logo={p.companyLogo} company={p.company} size={36} />
          <div>
            <p className="pl-fc-company">{p.company}</p>
            <p className="pl-fc-role">{p.role}</p>
          </div>
        </div>
        <h3 className="pl-fc-name">{p.studentName}</h3>
        <div className="pl-fc-meta">
          <span className="pl-fc-pkg">💰 {p.package}</span>
          <span className="pl-fc-batch">Batch {p.batch}</span>
        </div>
        {p.testimonial && (
          <blockquote className="pl-fc-quote">"{p.testimonial}"</blockquote>
        )}
      </div>
    </div>
  );
}

function PlacementCard({ p, idx }) {
  return (
    <div className="pl-card" style={{ animationDelay: `${idx * 0.06}s` }}>
      <div className="pl-card-top">
        <div className="pl-student-photo">
          {p.photo
            ? <img src={p.photo} alt={p.studentName} />
            : <span>{p.studentName.charAt(0)}</span>
          }
        </div>
        <span className={`pl-type-badge ${p.type === "Internship" ? "intern" : "fulltime"}`}>
          {p.type}
        </span>
      </div>
      <div className="pl-card-body">
        <h4 className="pl-student-name">{p.studentName}</h4>
        <p className="pl-card-role">{p.role}</p>
        <div className="pl-card-company">
          <CompanyLogo logo={p.companyLogo} company={p.company} size={26} />
          <span>{p.company}</span>
        </div>
        <div className="pl-card-footer">
          <span className="pl-pkg-chip">💰 {p.package}</span>
          <span className="pl-batch-chip">'{p.batch.slice(-2)}</span>
        </div>
      </div>
    </div>
  );
}