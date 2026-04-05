import React, { useRef } from "react";
import "./PlacementForm.css";

export default function PlacementForm({
  show, onClose, onSubmit, isEdit, loading,
  formData, setFormData,
  photoPreview, logoPreview,
  onPhotoChange, onLogoChange,
}) {
  const photoRef = useRef();
  const logoRef  = useRef();
  if (!show) return null;

  return (
    <div className="pf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal">

        <div className="pf-header">
          <div className="pf-header-left">
            <div className="pf-header-icon">🎓</div>
            <div>
              <h3>{isEdit ? "Update Placement" : "Add New Placement"}</h3>
              <p className="pf-header-sub">Record a student success story</p>
            </div>
          </div>
          <button type="button" className="pf-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="pf-form" onSubmit={e => { e.preventDefault(); onSubmit(e); }}>
          <div className="pf-body">

            {/* Photo uploads */}
            <div className="pf-uploads-row">
              {/* Student photo */}
              <div className="pf-upload-item">
                <div
                  className="pf-upload-zone pf-round"
                  onClick={() => photoRef.current.click()}
                >
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Student" className="pf-upload-img pf-round" />
                      <div className="pf-upload-overlay"><span>🔄</span></div>
                    </>
                  ) : (
                    <div className="pf-upload-empty">
                      <span className="pf-upload-icon">👤</span>
                    </div>
                  )}
                </div>
                <span className="pf-upload-label">Student Photo</span>
                <input ref={photoRef} type="file" accept="image/*" onChange={onPhotoChange} hidden />
              </div>

              {/* Company logo */}
              <div className="pf-upload-item">
                <div
                  className="pf-upload-zone pf-square"
                  onClick={() => logoRef.current.click()}
                >
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Company logo" className="pf-upload-img pf-square" />
                      <div className="pf-upload-overlay"><span>🔄</span></div>
                    </>
                  ) : (
                    <div className="pf-upload-empty">
                      <span className="pf-upload-icon">🏢</span>
                    </div>
                  )}
                </div>
                <span className="pf-upload-label">Company Logo</span>
                <input ref={logoRef} type="file" accept="image/*" onChange={onLogoChange} hidden />
              </div>

              {/* Featured toggle */}
              <label className="pf-featured-toggle">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <div className="pf-toggle-text">
                  <span>⭐ Feature this</span>
                  <span className="pf-toggle-sub">Show on homepage spotlight</span>
                </div>
              </label>
            </div>

            {/* Type selector */}
            <div className="pf-field">
              <label className="pf-label">Placement Type <span className="pf-req">*</span></label>
              <div className="pf-type-grid">
                {[
                  { val: "Full-Time",  icon: "💼", desc: "Permanent role" },
                  { val: "Internship", icon: "🛠️", desc: "Intern position" },
                ].map(({ val, icon, desc }) => (
                  <button
                    key={val} type="button"
                    className={`pf-type-btn ${formData.type === val ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, type: val })}
                  >
                    <span className="pf-type-icon">{icon}</span>
                    <div>
                      <span className="pf-type-name">{val}</span>
                      <span className="pf-type-desc">{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="pf-row">
              <div className="pf-field">
                <label className="pf-label">Student Name <span className="pf-req">*</span></label>
                <input
                  autoFocus type="text" className="pf-input"
                  placeholder="e.g. Rahul Kumar"
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  required
                />
              </div>
              <div className="pf-field">
                <label className="pf-label">Batch Year <span className="pf-req">*</span></label>
                <input
                  type="text" className="pf-input"
                  placeholder="e.g. 2024"
                  value={formData.batch}
                  onChange={e => setFormData({ ...formData, batch: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pf-row">
              <div className="pf-field">
                <label className="pf-label">Company <span className="pf-req">*</span></label>
                <input
                  type="text" className="pf-input"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="pf-field">
                <label className="pf-label">Role / Position <span className="pf-req">*</span></label>
                <input
                  type="text" className="pf-input"
                  placeholder="e.g. Software Engineer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pf-field">
              <label className="pf-label">Package / Stipend <span className="pf-req">*</span></label>
              <input
                type="text" className="pf-input"
                placeholder="e.g. 12 LPA or ₹25,000/month"
                value={formData.package}
                onChange={e => setFormData({ ...formData, package: e.target.value })}
                required
              />
            </div>

            <div className="pf-field">
              <label className="pf-label">
                Student Testimonial
                <span className="pf-optional"> (optional)</span>
              </label>
              <textarea
                className="pf-input pf-textarea" rows="3"
                placeholder="Share the student's experience in their own words…"
                value={formData.testimonial}
                onChange={e => setFormData({ ...formData, testimonial: e.target.value })}
              />
            </div>

          </div>

          <div className="pf-footer">
            <button type="button" className="pf-btn pf-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="pf-btn pf-btn--submit" disabled={loading}>
              {loading ? <span className="pf-spinner" /> : null}
              {loading ? "Processing…" : isEdit ? "Update Placement" : "🎓 Add Placement"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}