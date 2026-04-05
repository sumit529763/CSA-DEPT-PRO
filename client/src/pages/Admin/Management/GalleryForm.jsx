import React, { useRef } from "react";
import "./GalleryForm.css";

export default function GalleryForm({
  show, onClose, onSubmit, isEdit, loading,
  formData, setFormData, preview, onImageChange,
}) {
  const fileRef = useRef();
  if (!show) return null;

  const categories = [
    { val:"Infrastructure", icon:"🏛️" },
    { val:"Events",         icon:"🎉" },
    { val:"Academic",       icon:"📚" },
  ];

  return (
    <div className="gf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gf-modal">

        <div className="gf-header">
          <div className="gf-header-left">
            <div className="gf-header-icon">🖼️</div>
            <div>
              <h3>{isEdit ? "Edit Gallery Image" : "Add Gallery Image"}</h3>
              <p className="gf-header-sub">Department photo gallery</p>
            </div>
          </div>
          <button type="button" className="gf-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="gf-form" onSubmit={onSubmit}>
          <div className="gf-body">

            <div className="gf-field">
              <label className="gf-label">Upload Image <span className="gf-req">*</span></label>
              <div className="gf-upload" onClick={() => fileRef.current.click()}>
                {preview ? (
                  <div className="gf-preview-wrap">
                    <img src={preview} alt="Gallery preview" className="gf-preview" />
                    <div className="gf-preview-overlay">
                      <span>🔄 Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="gf-upload-empty">
                    <span className="gf-upload-icon-lg">📸</span>
                    <span>Tap to select photo</span>
                    <span className="gf-upload-hint">JPG, PNG, WebP · Max 10MB</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onImageChange} hidden required={!isEdit} />
            </div>

            <div className="gf-field">
              <label className="gf-label">Caption <span className="gf-req">*</span></label>
              <input type="text" className="gf-input" required
                placeholder="Describe this image briefly…"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })} />
            </div>

            <div className="gf-field">
              <label className="gf-label">Category <span className="gf-req">*</span></label>
              <div className="gf-cat-grid">
                {categories.map(({val, icon}) => (
                  <button key={val} type="button"
                    className={`gf-cat-btn ${formData.category === val ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, category: val })}>
                    <span className="gf-cat-icon">{icon}</span>
                    <span>{val}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="gf-footer">
            <button type="button" className="gf-btn gf-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="gf-btn gf-btn--submit" disabled={loading}>
              {loading ? <span className="gf-spinner" /> : null}
              {loading ? "Uploading…" : isEdit ? "Update Image" : "📤 Upload"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}