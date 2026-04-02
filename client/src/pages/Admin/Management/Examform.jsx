import React, { useRef } from "react";
import "./ExamForm.css";

export default function ExamForm({
  show, onClose, onSubmit, isEdit, loading,
  formData, setFormData, file, existingFileUrl, onFileChange,
}) {
  const fileRef = useRef();
  if (!show) return null;
  const cat = formData.category;

  return (
    <div className="ef-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ef-modal">

        <div className="ef-header">
          <div className="ef-header-left">
            <span className={`ef-chip ef-chip--${cat?.toLowerCase()}`}>{cat}</span>
            <h3>{isEdit ? `Edit ${cat?.slice(0,-1)}` : `Add ${cat?.slice(0,-1)}`}</h3>
          </div>
          <button type="button" className="ef-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="ef-form" onSubmit={onSubmit}>
          <div className="ef-body">

            {!isEdit && (
              <div className="ef-field">
                <label className="ef-label">Category <span className="ef-req">*</span></label>
                <div className="ef-seg">
                  {["Schedules","Results","Resources"].map((c) => (
                    <button key={c} type="button"
                      className={`ef-seg-btn ${formData.category === c ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, category: c })}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ef-field">
              <label className="ef-label">Title <span className="ef-req">*</span></label>
              <input autoFocus type="text" className="ef-input" maxLength={160}
                placeholder={
                  cat === "Schedules" ? "e.g. BCA 1st Year Semester-I Final Exam"
                  : cat === "Results"  ? "e.g. BCA Semester-IV Regular Results - 2025"
                  : "e.g. Examination Rules & Regulations Handbook"
                }
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required />
              <div className="ef-char">{formData.title.length}/160</div>
            </div>

            {cat === "Schedules" && (
              <div className="ef-row">
                <div className="ef-field">
                  <label className="ef-label">Subject Code</label>
                  <input type="text" className="ef-input" placeholder="e.g. CS-101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                </div>
                <div className="ef-field">
                  <label className="ef-label">Exam Date</label>
                  <input type="date" className="ef-input"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })} />
                </div>
              </div>
            )}

            {cat === "Results" && (
              <div className="ef-field">
                <label className="ef-label">Release Date</label>
                <input type="date" className="ef-input"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })} />
              </div>
            )}

            {cat === "Resources" && (
              <div className="ef-field">
                <label className="ef-label">Resource Type</label>
                <div className="ef-seg">
                  {["PDF","Link"].map((t) => (
                    <button key={t} type="button"
                      className={`ef-seg-btn ${formData.resourceType === t ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, resourceType: t })}>
                      {t === "PDF" ? "📄 PDF" : "🔗 Link"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cat === "Resources" && formData.resourceType === "Link" && (
              <div className="ef-field">
                <label className="ef-label">External URL</label>
                <input type="url" className="ef-input" placeholder="https://..."
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} />
              </div>
            )}

            {!(cat === "Resources" && formData.resourceType === "Link") && (
              <div className="ef-field">
                <label className="ef-label">
                  {cat === "Schedules" ? "Upload Time-Table (PDF)"
                   : cat === "Results"  ? "Upload Result PDF"
                   : "Upload File (PDF)"}
                </label>
                <div className="ef-upload" onClick={() => fileRef.current.click()}>
                  {file ? (
                    <div className="ef-upload-chosen">
                      <span className="ef-upload-icon">📄</span>
                      <span className="ef-upload-name">{file.name}</span>
                      <button type="button" className="ef-upload-remove"
                        onClick={(e) => { e.stopPropagation(); onFileChange({ target: { files: [] } }); }}>
                        ×
                      </button>
                    </div>
                  ) : existingFileUrl ? (
                    <div className="ef-upload-existing">
                      <span>📎</span>
                      <a href={existingFileUrl} target="_blank" rel="noreferrer">Current file</a>
                      <span className="ef-upload-hint">· tap to replace</span>
                    </div>
                  ) : (
                    <div className="ef-upload-empty">
                      <span className="ef-upload-icon-lg">☁</span>
                      <span>Tap to upload PDF</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="application/pdf,image/*" onChange={onFileChange} hidden />
              </div>
            )}

            <div className="ef-toggle-row">
              <div className="ef-toggle-info">
                <span className="ef-toggle-title">Published</span>
                <span className="ef-toggle-sub">Visible to students on the portal</span>
              </div>
              <button type="button" role="switch" aria-checked={formData.isPublished}
                className={`ef-switch ${formData.isPublished ? "on" : ""}`}
                onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}>
                <div className="ef-switch-thumb" />
              </button>
            </div>

          </div>

          <div className="ef-footer">
            <button type="button" className="ef-btn ef-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="ef-btn ef-btn--submit" disabled={loading}>
              {loading ? <span className="ef-spinner" /> : null}
              {loading ? "Saving…" : isEdit ? `Update ${cat?.slice(0,-1)}` : `Add ${cat?.slice(0,-1)}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}