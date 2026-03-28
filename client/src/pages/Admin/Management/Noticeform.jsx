import React, { useRef } from "react";
import "./NoticeForm.css";

export default function NoticeForm({
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

  return (
    <div className="nf-overlay">
      <div className="nf-modal">

        {/* HEADER */}
        <div className="nf-header">
          <h3>{isEdit ? "Edit Notice" : "Add New Notice"}</h3>
          <button type="button" onClick={onClose}>×</button>
        </div>

        {/* FORM */}
        <form className="nf-form" onSubmit={onSubmit}>
          <div className="nf-body">

            {/* TITLE */}
            <div className="nf-field">
              <label>Notice Title <span className="nf-req">*</span></label>
              <input
                autoFocus
                type="text"
                maxLength={160}
                placeholder="Enter official notice title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <div className="nf-char">{formData.title.length}/160</div>
            </div>

            {/* DATE + TYPE row */}
            <div className="nf-row">
              <div className="nf-field">
                <label>Date <span className="nf-req">*</span></label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="nf-field">
                <label>Category <span className="nf-req">*</span></label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option>General</option>
                  <option>Exam</option>
                  <option>Holiday</option>
                  <option>Academic</option>
                </select>
              </div>
            </div>

            {/* TOGGLES row */}
            <div className="nf-row nf-toggles">
              <label className="nf-switch-label">
                <span>Mark as Urgent</span>
                <div
                  className={`nf-switch ${formData.isUrgent ? "on" : ""}`}
                  onClick={() =>
                    setFormData({ ...formData, isUrgent: !formData.isUrgent })
                  }
                >
                  <div className="nf-switch-thumb" />
                </div>
              </label>

              <label className="nf-switch-label">
                <span>Published</span>
                <div
                  className={`nf-switch ${formData.isPublished ? "on" : ""}`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isPublished: !formData.isPublished,
                    })
                  }
                >
                  <div className="nf-switch-thumb" />
                </div>
              </label>
            </div>

            {/* FILE UPLOAD */}
            <div className="nf-field">
              <label>Attach File (PDF / Image)</label>
              <div
                className="nf-upload-area"
                onClick={() => fileRef.current.click()}
              >
                {file ? (
                  <div className="nf-file-chosen">
                    <i className="fas fa-file-alt" />
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="nf-remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileChange({ target: { files: [] } });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : existingFileUrl ? (
                  <div className="nf-file-existing">
                    <i className="fas fa-file-pdf" />
                    <a href={existingFileUrl} target="_blank" rel="noreferrer">
                      Current file attached
                    </a>
                    <span className="nf-replace-hint">
                      (click to replace)
                    </span>
                  </div>
                ) : (
                  <div className="nf-upload-placeholder">
                    <i className="fas fa-cloud-upload-alt" />
                    <span>Click to upload PDF or image</span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={onFileChange}
                hidden
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="nf-footer">
            <button type="button" className="nf-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="nf-submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Notice"
                : "Publish Notice"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}