import React, { useRef } from "react";
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

  const fileRef = useRef();

  if (!show) return null;

  const removeImage = () => {
    setFormData({ ...formData, image: null });
  };

  return (
    <div className="newsModalOverlay">

      <div className="newsModal">

        {/* HEADER */}

        <div className="newsModalHeader">

          <h3>
            {isEdit ? "Edit News Post" : "Add News Post"}
          </h3>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* FORM */}

        <form
          className="newsModalForm"
          onSubmit={onSubmit}
        >

          <div className="newsModalBody">

            {/* TITLE */}

            <div className="newsField">

              <label>News Title</label>

              <input
                autoFocus
                type="text"
                maxLength="120"
                placeholder="Enter an engaging title..."
                value={formData.title}
                onChange={(e)=>
                  setFormData({
                    ...formData,
                    title:e.target.value
                  })
                }
                required
              />

              <div className="charCount">
                {formData.title.length}/120
              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="newsField">

              <label>Content Description</label>

              <textarea
                rows="5"
                maxLength="1000"
                placeholder="Write news content here..."
                value={formData.description}
                onChange={(e)=>
                  setFormData({
                    ...formData,
                    description:e.target.value
                  })
                }
                required
              />

              <div className="charCount">
                {formData.description.length}/1000
              </div>

            </div>


            {/* IMAGE UPLOAD */}

            <div className="newsField">

              <label>Feature Image</label>

              <div
                className="uploadArea"
                onClick={()=>fileRef.current.click()}
              >

                {preview ? (

                  <img
                    src={preview}
                    alt="preview"
                    className="newsPreview"
                  />

                ) : (

                  <div className="uploadPlaceholder">
                    📷 Click to upload image
                  </div>

                )}

              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                hidden
              />

              {preview && (
                <button
                  type="button"
                  className="removeImgBtn"
                  onClick={removeImage}
                >
                  Remove Image
                </button>
              )}

            </div>

          </div>


          {/* FOOTER */}

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