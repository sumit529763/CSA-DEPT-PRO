import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Faculty.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // ✅ fixed env var

export default function Faculty() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [hod, setHod]         = useState(null);
  const [staff, setStaff]     = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/faculty`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Server returned ${res.status} — check if backend is running`);
        }
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to load faculty");
        setHod(json.data.find((f) => f.isHOD) || null);
        setStaff(json.data.filter((f) => !f.isHOD));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  return (
    <div className="faculty-page">
      {/* HERO HEADER */}
      <div className="fhh">
        <div className="fhh-shapes">
          <div className="fhh-s1" />
          <div className="fhh-s2" />
          <div className="fhh-s3" />
        </div>
        <div className="fhh-inner container">
          <span className="fhh-eyebrow">
            Department of Computer Science &amp; Applications
          </span>
          <h1 className="fhh-title">
            Meet Our <em>Faculty</em>
          </h1>
          <p className="fhh-sub">
            Scholars, researchers &amp; mentors shaping the next generation of
            tech innovators
          </p>
          <div className="fhh-stats">
            {!loading && (
              <>
                <span>
                  <strong>{(hod ? 1 : 0) + staff.length}</strong> Faculty Members
                </span>
                <span className="fhh-dot">·</span>
              </>
            )}
            <span><strong>GIET University</strong></span>
          </div>
        </div>
      </div>

      <div className="faculty-body container">
        {error && (
          <div className="faculty-error">
            <i className="fas fa-exclamation-triangle" /> {error}
          </div>
        )}

        {/* HOD SPOTLIGHT */}
        <section className="hod-section">
          <div className="hod-track">
            <span className="hod-pill">
              <i className="fas fa-crown" /> Head of Department
            </span>
            <div className="hod-line" />
          </div>

          {loading ? (
            <div className="hod-card skeleton-card">
              <div className="skeleton hod-sk-img" />
              <div className="hod-sk-body">
                <div className="skeleton sk-badge" />
                <div className="skeleton sk-title" />
                <div className="skeleton sk-line" />
                <div className="skeleton sk-line sk-short" />
                <div className="skeleton sk-btn" />
              </div>
            </div>
          ) : hod ? (
            <div className="hod-card">
              <div className="hod-stripe" />
              <div className="hod-photo-col">
                <div className="hod-frame">
                  <div className="hod-ring" />
                  <img
                    src={hod.photo || "https://placehold.co/300x300/e8edff/2563eb?text=HOD"}
                    alt={hod.name}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/300x300/e8edff/2563eb?text=HOD"; // ✅ fixed
                    }}
                  />
                  <div className="hod-crown">
                    <i className="fas fa-crown" />
                  </div>
                </div>
              </div>

              <div className="hod-info">
                <div className="hod-meta">
                  <span className="hod-tag-dept">CSA Department</span>
                  <span className="hod-sep">|</span>
                  <span className="hod-tag-dept">GIET University</span>
                </div>
                <h2 className="hod-name">{hod.name}</h2>
                <p className="hod-desig">{hod.designation}</p>

                {hod.qualification && (
                  <div className="hod-row">
                    <i className="fas fa-graduation-cap hod-icon" />
                    <span>{hod.qualification}</span>
                  </div>
                )}
                {hod.specialization && (
                  <div className="hod-row">
                    <i className="fas fa-flask hod-icon" />
                    <span>{hod.specialization}</span>
                  </div>
                )}
                {hod.email && (
                  <div className="hod-row">
                    <i className="fas fa-envelope hod-icon" />
                    <a href={`mailto:${hod.email}`}>{hod.email}</a>
                  </div>
                )}

                {hod.expertise?.length > 0 && (
                  <div className="hod-tags">
                    {hod.expertise.slice(0, 4).map((t, i) => (
                      <span key={i} className="hod-exp-tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="hod-actions">
                  <Link to={`/faculty/${hod._id}`} className="btn-primary">
                    Full Profile <i className="fas fa-arrow-right" />
                  </Link>
                  {hod.scholarUrl && (
                    <a href={hod.scholarUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                      <i className="fas fa-graduation-cap" /> Google Scholar
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : !error ? (
            <p className="empty-msg">No HOD record found.</p>
          ) : null}
        </section>

        {/* TEACHING FACULTY */}
        <section className="teaching-section">
          <div className="teaching-header">
            <div className="teaching-left">
              <div className="accent-bar" />
              <div>
                <h3 className="teaching-title">Teaching Faculty</h3>
                <p className="teaching-sub">
                  Our dedicated team of educators &amp; researchers
                </p>
              </div>
            </div>
            {!loading && staff.length > 0 && (
              <span className="count-badge">{staff.length} Members</span>
            )}
          </div>

          <div className="faculty-grid">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="fc-card skeleton-card">
                  <div className="skeleton fc-sk-img" />
                  <div className="fc-sk-body">
                    <div className="skeleton sk-line" />
                    <div className="skeleton sk-line sk-short" />
                    <div className="skeleton sk-line sk-xshort" />
                  </div>
                </div>
              ))
            ) : staff.length === 0 && !error ? (
              <p className="empty-msg">No faculty members added yet.</p>
            ) : (
              staff.map((m, idx) => (
                <div
                  key={m._id}
                  className="fc-card"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  <div className="fc-img-wrap">
                    <img
                      src={m.photo || "https://placehold.co/280x280/e8edff/2563eb?text=Faculty"} // ✅ fixed
                      alt={m.name}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/280x280/e8edff/2563eb?text=Faculty"; // ✅ fixed
                      }}
                    />
                    <div className="fc-overlay">
                      <Link to={`/faculty/${m._id}`} className="fc-ov-btn" title="View Profile">
                        <i className="fas fa-user" />
                      </Link>
                      {m.scholarUrl && (
                        <a href={m.scholarUrl} target="_blank" rel="noreferrer" className="fc-ov-btn" title="Scholar">
                          <i className="fas fa-graduation-cap" />
                        </a>
                      )}
                      <a href={`mailto:${m.email}`} className="fc-ov-btn" title="Email">
                        <i className="fas fa-envelope" />
                      </a>
                    </div>
                    <div className="fc-num">0{idx + 1}</div>
                  </div>
                  <div className="fc-body">
                    <span className="fc-desig">{m.designation}</span>
                    <h4 className="fc-name">{m.name}</h4>
                    {m.specialization && <p className="fc-spec">{m.specialization}</p>}
                    {m.expertise?.length > 0 && (
                      <div className="fc-tags">
                        {m.expertise.slice(0, 2).map((t, i) => (
                          <span key={i} className="fc-tag">{t}</span>
                        ))}
                      </div>
                    )}
                    <Link to={`/faculty/${m._id}`} className="fc-link">
                      View Profile <i className="fas fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}