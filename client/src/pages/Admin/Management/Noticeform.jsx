import React, { useRef } from "react";
import "./NoticeForm.css";

export default function NoticeForm({
  show, onClose, onSubmit, isEdit, loading,
  formData, setFormData, file, existingFileUrl, onFileChange,
}) {
  const fileRef = useRef();
  if (!show) return null;

  return (
    <div className="nf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="nf-modal">

        <div className="nf-header">
          <div className="nf-header-left">
            <div className="nf-header-icon">📋</div>
            <div>
              <h3>{isEdit ? "Edit Notice" : "Add New Notice"}</h3>
              <p className="nf-header-sub">Department communication board</p>
            </div>
          </div>
          <button type="button" className="nf-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="nf-form" onSubmit={onSubmit}>
          <div className="nf-body">

            <div className="nf-field">
              <label className="nf-label">Notice Title <span className="nf-req">*</span></label>
              <input autoFocus type="text" className="nf-input" maxLength={160}
                placeholder="Enter official notice title…"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required />
              <div className="nf-char">{formData.title.length}/160</div>
            </div>

            <div className="nf-row">
              <div className="nf-field">
                <label className="nf-label">Date <span className="nf-req">*</span></label>
                <input type="date" className="nf-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required />
              </div>
              <div className="nf-field">
                <label className="nf-label">Category <span className="nf-req">*</span></label>
                <select className="nf-input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option>General</option>
                  <option>Exam</option>
                  <option>Holiday</option>
                  <option>Academic</option>
                </select>
              </div>
            </div>

            <div className="nf-toggles">
              <div className="nf-toggle-item">
                <div className="nf-toggle-info">
                  <span className="nf-toggle-title">🚨 Mark as Urgent</span>
                  <span className="nf-toggle-sub">Pin to top, shown with red badge</span>
                </div>
                <button type="button" role="switch" aria-checked={formData.isUrgent}
                  className={`nf-switch ${formData.isUrgent ? "on urgent" : ""}`}
                  onClick={() => setFormData({ ...formData, isUrgent: !formData.isUrgent })}>
                  <div className="nf-switch-thumb" />
                </button>
              </div>
              <div className="nf-toggle-divider" />
              <div className="nf-toggle-item">
                <div className="nf-toggle-info">
                  <span className="nf-toggle-title">✅ Published</span>
                  <span className="nf-toggle-sub">Visible to students on portal</span>
                </div>
                <button type="button" role="switch" aria-checked={formData.isPublished}
                  className={`nf-switch ${formData.isPublished ? "on" : ""}`}
                  onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}>
                  <div className="nf-switch-thumb" />
                </button>
              </div>
            </div>

            <div className="nf-field">
              <label className="nf-label">Attach File <span className="nf-optional">(PDF / Image)</span></label>
              <div className="nf-upload" onClick={() => fileRef.current.click()}>
                {file ? (
                  <div className="nf-upload-chosen">
                    <span className="nf-upload-icon">📄</span>
                    <span className="nf-upload-name">{file.name}</span>
                    <button type="button" className="nf-upload-remove"
                      onClick={(e) => { e.stopPropagation(); onFileChange({ target: { files: [] } }); }}>×</button>
                  </div>
                ) : existingFileUrl ? (
                  <div className="nf-upload-existing">
                    <span>📎</span>
                    <a href={existingFileUrl} target="_blank" rel="noreferrer">Current file attached</a>
                    <span className="nf-upload-hint">· tap to replace</span>
                  </div>
                ) : (
                  <div className="nf-upload-empty">
                    <span className="nf-upload-icon-lg">☁</span>
                    <span>Tap to upload PDF or image</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={onFileChange} hidden />
            </div>

          </div>

          <div className="nf-footer">
            <button type="button" className="nf-btn nf-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="nf-btn nf-btn--submit" disabled={loading}>
              {loading ? <span className="nf-spinner" /> : null}
              {loading ? "Saving…" : isEdit ? "Update Notice" : "Publish Notice"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}