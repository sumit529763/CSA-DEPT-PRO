import React, { useRef } from "react";
import "./NewsForm.css";

export default function NewsForm({
  show, onClose, onSubmit, isEdit, loading,
  formData, setFormData, preview, onImageChange,
}) {
  const fileRef = useRef();
  if (!show) return null;

  return (
    <div className="nsf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="nsf-modal">

        <div className="nsf-header">
          <div className="nsf-header-left">
            <div className="nsf-header-icon">📰</div>
            <div>
              <h3>{isEdit ? "Edit News Post" : "Add News Post"}</h3>
              <p className="nsf-header-sub">Department news & announcements</p>
            </div>
          </div>
          <button type="button" className="nsf-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="nsf-form" onSubmit={onSubmit}>
          <div className="nsf-body">

            <div className="nsf-field">
              <label className="nsf-label">News Title <span className="nsf-req">*</span></label>
              <input autoFocus type="text" className="nsf-input" maxLength="120"
                placeholder="Enter an engaging headline…"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required />
              <div className="nsf-char">{formData.title.length}/120</div>
            </div>

            <div className="nsf-field">
              <label className="nsf-label">Content <span className="nsf-req">*</span></label>
              <textarea className="nsf-input nsf-textarea" rows="5" maxLength="1000"
                placeholder="Write the full news content here…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required />
              <div className="nsf-char">{formData.description.length}/1000</div>
            </div>

            <div className="nsf-field">
              <label className="nsf-label">Feature Image <span className="nsf-optional">(recommended)</span></label>
              <div className="nsf-upload" onClick={() => fileRef.current.click()}>
                {preview ? (
                  <div className="nsf-preview-wrap">
                    <img src={preview} alt="News preview" className="nsf-preview" />
                    <div className="nsf-preview-overlay">
                      <span>🔄 Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="nsf-upload-empty">
                    <span className="nsf-upload-icon-lg">📷</span>
                    <span>Tap to upload feature image</span>
                    <span className="nsf-upload-hint">JPG, PNG, WebP · Recommended 16:9</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onImageChange} hidden />
              {preview && (
                <button type="button" className="nsf-remove-btn"
                  onClick={() => setFormData({ ...formData, image: null })}>
                  🗑 Remove Image
                </button>
              )}
            </div>

          </div>

          <div className="nsf-footer">
            <button type="button" className="nsf-btn nsf-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="nsf-btn nsf-btn--submit" disabled={loading}>
              {loading ? <span className="nsf-spinner" /> : null}
              {loading ? "Publishing…" : isEdit ? "Update Post" : "📤 Publish"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}