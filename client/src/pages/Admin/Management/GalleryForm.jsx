import React from "react";
import "./GalleryForm.css";

export default function GalleryForm({
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
    <div className="galleryModalOverlay">
      <div className="galleryModal">
        
        {/* HEADER */}
        <div className="galleryModalHeader">
          <h3>{isEdit ? "Edit Gallery Image" : "Add Gallery Image"}</h3>
          <button type="button" onClick={onClose}>×</button>
        </div>

        {/* FORM */}
        <form className="galleryModalForm" onSubmit={onSubmit}>
          
          {/* BODY */}
          <div className="galleryModalBody">
            <div className="galleryField">
              <label>Image Caption</label>
              <input
                type="text"
                required
                placeholder="Enter image caption..."
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
              />
            </div>

            {/* NEW: Category Dropdown */}
            <div className="galleryField">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="Events">Events</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            <div className="galleryField">
              <label>Upload Image</label>
              {preview && (
                <img src={preview} alt="preview" className="galleryPreview" />
              )}
              <input
                type="file"
                id="upload-gallery"
                accept="image/*"
                onChange={onImageChange}
                hidden
                required={!isEdit} // Only require image if it's a new upload
              />
              <label htmlFor="upload-gallery" className="uploadBtn" style={{ marginTop: '10px' }}>
                📷 {preview ? "Change Image" : "Select Image"}
              </label>
            </div>
          </div>

          {/* FOOTER */}
          <div className="galleryModalFooter">
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submitBtn" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Upload"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}