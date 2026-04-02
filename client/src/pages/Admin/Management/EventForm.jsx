import React, { useRef } from "react";
import "./EventForm.css";

export default function EventForm({
  show, onClose, onSubmit, isEdit, loading,
  formData, setFormData, preview, onImageChange,
}) {
  const fileRef = useRef();
  if (!show) return null;

  return (
    <div className="evf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="evf-modal">

        <div className="evf-header">
          <div className="evf-header-left">
            <div className="evf-header-icon">🎉</div>
            <div>
              <h3>{isEdit ? "Update Event" : "Create New Event"}</h3>
              <p className="evf-header-sub">Add to department calendar</p>
            </div>
          </div>
          <button type="button" className="evf-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="evf-form" onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>
          <div className="evf-body">

            <div className="evf-field">
              <label className="evf-label">Event Title <span className="evf-req">*</span></label>
              <input autoFocus type="text" className="evf-input" maxLength="100"
                placeholder="e.g. Annual Tech Hackathon 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required />
            </div>

            <div className="evf-row">
              <div className="evf-field">
                <label className="evf-label">Event Date <span className="evf-req">*</span></label>
                <input type="date" className="evf-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required />
              </div>
              <div className="evf-field">
                <label className="evf-label">Start Time <span className="evf-req">*</span></label>
                <input type="text" className="evf-input" placeholder="e.g. 10:00 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required />
              </div>
            </div>

            <div className="evf-field">
              <label className="evf-label">Venue / Location <span className="evf-req">*</span></label>
              <input type="text" className="evf-input" placeholder="e.g. Seminar Hall, Academic Block 1"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required />
            </div>

            <div className="evf-field">
              <label className="evf-label">Category <span className="evf-req">*</span></label>
              <div className="evf-cat-grid">
                {[
                  { val:"Hackathon", icon:"💻" },
                  { val:"Workshop", icon:"🔧" },
                  { val:"Seminar",  icon:"🎤" },
                  { val:"Freshers", icon:"🎓" },
                ].map(({val,icon}) => (
                  <button key={val} type="button"
                    className={`evf-cat-btn ${formData.category === val ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, category: val })}>
                    <span className="evf-cat-icon">{icon}</span>
                    <span>{val}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="evf-field">
              <label className="evf-label">Description <span className="evf-req">*</span></label>
              <textarea className="evf-input evf-textarea" rows="3"
                placeholder="Describe the event objectives and details…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required />
            </div>

            <div className="evf-field">
              <label className="evf-label">Event Poster <span className="evf-optional">(recommended)</span></label>
              <div className="evf-upload" onClick={() => fileRef.current.click()}>
                {preview ? (
                  <div className="evf-preview-wrap">
                    <img src={preview} alt="Event poster preview" className="evf-preview" />
                    <div className="evf-preview-overlay">
                      <span>🔄 Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="evf-upload-empty">
                    <span className="evf-upload-icon-lg">🖼️</span>
                    <span>Tap to upload event banner</span>
                    <span className="evf-upload-hint">JPG, PNG, WebP · Max 5MB</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onImageChange} hidden />
            </div>

          </div>

          <div className="evf-footer">
            <button type="button" className="evf-btn evf-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="evf-btn evf-btn--submit" disabled={loading}>
              {loading ? <span className="evf-spinner" /> : null}
              {loading ? "Processing…" : isEdit ? "Update Event" : "🎉 Publish Event"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}