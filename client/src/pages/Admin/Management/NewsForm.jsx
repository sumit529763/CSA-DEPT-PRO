import React from "react";

export default function NewsForm({ 
  show, 
  onClose, 
  onSubmit, 
  isEdit, 
  loading, 
  formData, 
  setFormData, 
  preview, 
  onImageChange 
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* FIXED HEADER */}
        <div className="modal-header">
          <h3>{isEdit ? "Edit News Post" : "Add News Post"}</h3>
          <button className="close-x" onClick={onClose} type="button">&times;</button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          {/* SCROLLABLE BODY */}
          <div className="modal-body">
            <div className="form-group">
              <label>News Title</label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Content Description</label>
              <textarea
                placeholder="Write news content here..."
                rows="6"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Feature Image</label>
              <div className="image-upload-wrapper">
                {preview && (
                  <div className="preview-container">
                    <img src={preview} alt="Preview" className="image-preview-box" />
                  </div>
                )}
                <input
                  type="file"
                  id="news-image-upload"
                  accept="image/*"
                  onChange={onImageChange}
                  hidden
                />
                <label htmlFor="news-image-upload" className="custom-file-label">
                  <i className="fas fa-camera"></i> {preview ? "Change Image" : "Upload Image"}
                </label>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER WITH LOADING BUTTON */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>{isEdit ? "Update Changes" : "Publish News"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}