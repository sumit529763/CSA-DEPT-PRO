import React, { useRef } from "react";
import "./ExamForm.css";

export default function ExamForm({
  show,
  onClose,
  onSubmit,
  isEdit,
  loading,
  formData,
  setFormData,
  file,
  existingFileUrl,
  onFileChange,
}) {
  const fileRef = useRef();

  if (!show) return null;

  const cat = formData.category;

  return (
    <div className="ef-overlay">
      <div className="ef-modal">

        {/* HEADER */}
        <div className="ef-header">
          <div className="ef-header-left">
            <span className="ef-category-chip">{cat}</span>
            <h3>{isEdit ? `Edit ${cat.slice(0, -1)}` : `Add ${cat.slice(0, -1)}`}</h3>
          </div>
          <button type="button" onClick={onClose}>×</button>
        </div>

        {/* FORM */}
        <form className="ef-form" onSubmit={onSubmit}>
          <div className="ef-body">

            {/* CATEGORY (hidden in edit — can't change) */}
            {!isEdit && (
              <div className="ef-field">
                <label>Category <span className="ef-req">*</span></label>
                <div className="ef-cat-tabs">
                  {["Schedules", "Results", "Resources"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`ef-cat-tab ${formData.category === c ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, category: c })}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TITLE */}
            <div className="ef-field">
              <label>Title <span className="ef-req">*</span></label>
              <input
                autoFocus
                type="text"
                maxLength={160}
                placeholder={
                  cat === "Schedules"
                    ? "e.g. BCA 1st Year Semester-I Final Exam"
                    : cat === "Results"
                    ? "e.g. BCA Semester-IV Regular Results - 2025"
                    : "e.g. Examination Rules & Regulations Handbook"
                }
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <div className="ef-char">{formData.title.length}/160</div>
            </div>

            {/* SCHEDULES FIELDS */}
            {cat === "Schedules" && (
              <div className="ef-row">
                <div className="ef-field">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-101"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="ef-field">
                  <label>Exam Date</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) =>
                      setFormData({ ...formData, examDate: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* RESULTS FIELDS */}
            {cat === "Results" && (
              <div className="ef-field">
                <label>Release Date</label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseDate: e.target.value })
                  }
                />
              </div>
            )}

            {/* RESOURCES FIELDS */}
            {cat === "Resources" && (
              <div className="ef-field">
                <label>Resource Type</label>
                <div className="ef-res-type-tabs">
                  {["PDF", "Link"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`ef-res-tab ${formData.resourceType === t ? "active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, resourceType: t })
                      }
                    >
                      <i className={`fas ${t === "PDF" ? "fa-file-pdf" : "fa-link"}`} />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* External Link (Resources → Link type) */}
            {cat === "Resources" && formData.resourceType === "Link" && (
              <div className="ef-field">
                <label>External URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.fileUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, fileUrl: e.target.value })
                  }
                />
              </div>
            )}

            {/* FILE UPLOAD (Schedules + Results + Resources/PDF) */}
            {!(cat === "Resources" && formData.resourceType === "Link") && (
              <div className="ef-field">
                <label>
                  {cat === "Schedules"
                    ? "Upload Time-Table (PDF)"
                    : cat === "Results"
                    ? "Upload Result PDF"
                    : "Upload File (PDF)"}
                </label>
                <div
                  className="ef-upload-area"
                  onClick={() => fileRef.current.click()}
                >
                  {file ? (
                    <div className="ef-file-chosen">
                      <i className="fas fa-file-alt" />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="ef-remove-file"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileChange({ target: { files: [] } });
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : existingFileUrl ? (
                    <div className="ef-file-existing">
                      <i className="fas fa-file-pdf" />
                      <a href={existingFileUrl} target="_blank" rel="noreferrer">
                        Current file
                      </a>
                      <span className="ef-replace-hint">(click area to replace)</span>
                    </div>
                  ) : (
                    <div className="ef-upload-placeholder">
                      <i className="fas fa-cloud-upload-alt" />
                      <span>Click to upload PDF</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={onFileChange}
                  hidden
                />
              </div>
            )}

            {/* PUBLISH TOGGLE */}
            <div className="ef-field ef-toggle-row">
              <span>Published</span>
              <div
                className={`ef-switch ${formData.isPublished ? "on" : ""}`}
                onClick={() =>
                  setFormData({ ...formData, isPublished: !formData.isPublished })
                }
              >
                <div className="ef-switch-thumb" />
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="ef-footer">
            <button type="button" className="ef-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ef-submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? `Update ${cat.slice(0, -1)}` : `Add ${cat.slice(0, -1)}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}