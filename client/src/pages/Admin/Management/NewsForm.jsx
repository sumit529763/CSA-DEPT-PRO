import React from "react";
import "./NewsForm.css";

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
    <div className="newsModalOverlay">

      <div className="newsModal">

        <div className="newsModalHeader">
          <h3>{isEdit ? "Edit News Post" : "Add News Post"}</h3>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <form className="newsModalForm" onSubmit={onSubmit}>

          <div className="newsModalBody">

            <div className="newsField">
              <label>News Title</label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="newsField">
              <label>Content Description</label>
              <textarea
                rows="5"
                placeholder="Write news content here..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="newsField">
              <label>Feature Image</label>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="newsPreview"
                />
              )}

              <input
                type="file"
                id="upload-news"
                accept="image/*"
                onChange={onImageChange}
                hidden
              />

              <label htmlFor="upload-news" className="uploadBtn">
                📷 {preview ? "Change Image" : "Upload Image"}
              </label>

            </div>

          </div>

          <div className="newsModalFooter">
            <button
              type="button"
              className="cancelBtn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submitBtn"
              disabled={loading}
            >
              {loading
                ? "Publishing..."
                : isEdit
                ? "Update"
                : "Publish"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
