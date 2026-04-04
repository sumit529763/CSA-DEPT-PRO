import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FacultyDetails.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function FacultyDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [member, setMember]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMember = async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/faculty/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Faculty not found');
        setMember(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return (
    <div className="fd-wrapper">
      <div className="container fd-container">
        <div className="fd-card skeleton-card">
          <div className="fd-sidebar">
            <div className="skeleton" style={{ width:'100%', aspectRatio:'4/5', borderRadius:'20px' }} />
          </div>
          <div className="fd-content">
            <div className="skeleton" style={{ width:'90px', height:'22px', borderRadius:'50px', marginBottom:'14px' }} />
            <div className="skeleton" style={{ width:'62%', height:'36px', marginBottom:'10px' }} />
            <div className="skeleton" style={{ width:'44%', height:'18px', marginBottom:'28px' }} />
            {[100, 90, 80].map((w, i) => (
              <div key={i} className="skeleton" style={{ width:`${w}%`, height:'16px', marginBottom:'8px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !member) return (
    <div className="container" style={{ textAlign:'center', padding:'80px 20px' }}>
      <h2 style={{ color:'#0f172a', marginBottom:'16px' }}>
        {error || 'Faculty profile not found.'}
      </h2>
      <button className="btn-back" onClick={() => navigate('/faculty')}>
        <i className="fas fa-arrow-left" /> Return to Faculty List
      </button>
    </div>
  );

  return (
    <div className="fd-wrapper">
      <div className="container fd-container">

        <nav className="fd-nav">
          <button className="btn-back" onClick={() => navigate('/faculty')}>
            <i className="fas fa-arrow-left" /> Back to Faculty
          </button>
        </nav>

        <div className="fd-card">

          {/* Sidebar */}
          <div className="fd-sidebar">
            <div className="fd-img-frame">
              <img
                src={member.photo || 'https://placehold.co/280x350/e8edff/2563eb?text=Faculty'} // ✅ fixed
                alt={member.name}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/280x350/e8edff/2563eb?text=Faculty'; // ✅ fixed
                }}
              />
            </div>
            <div className="fd-quick-links">
              <a href={`mailto:${member.email}`} className="fd-link-item">
                <i className="fas fa-envelope" /> <span>Email Member</span>
              </a>
              {member.scholarUrl && (
                <a href={member.scholarUrl} target="_blank" rel="noreferrer" className="fd-link-item fd-scholar">
                  <i className="fas fa-graduation-cap" /> <span>Scholar Profile</span>
                </a>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="fd-content">
            <header className="fd-header">
              <span className="fd-desig-badge">{member.designation}</span>
              <h1 className="fd-full-name">{member.name}</h1>
              {member.qualification && (
                <p className="fd-degree">{member.qualification}</p>
              )}
              {member.specialization && (
                <p className="fd-degree" style={{ color:'#94a3b8' }}>
                  {member.specialization}
                </p>
              )}
            </header>

            {member.bio && (
              <section className="fd-section">
                <h3>
                  <span className="fd-sec-icon"><i className="fas fa-user-tie" /></span>
                  Biography
                </h3>
                <p className="fd-bio">{member.bio}</p>
              </section>
            )}

            {member.research && (
              <section className="fd-section">
                <h3>
                  <span className="fd-sec-icon"><i className="fas fa-flask" /></span>
                  Research Interests
                </h3>
                <p className="fd-bio">{member.research}</p>
              </section>
            )}

            {member.expertise?.length > 0 && (
              <section className="fd-section">
                <h3>
                  <span className="fd-sec-icon"><i className="fas fa-lightbulb" /></span>
                  Research Expertise
                </h3>
                <div className="fd-expertise">
                  {member.expertise.map((item, i) => (
                    <span key={i} className="fd-exp-tag">{item}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="fd-section">
              <h3>
                <span className="fd-sec-icon"><i className="fas fa-id-card" /></span>
                Contact
              </h3>
              <p className="fd-bio">
                <strong>Email: </strong>
                <a href={`mailto:${member.email}`} style={{ color:'#004aad' }}>
                  {member.email}
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}