import React, { useRef } from "react";
import "./EventForm.css";

export default function EventForm({
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

  // Return null if modal is not active to prevent rendering
  if (!show) return null;

  // Internal handler to prevent page reload and trigger parent logic
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e); // Passes the event to ManageEvents.jsx
  };

  return (
    <div className="eventModalOverlay">
      <div className="eventModal">
        {/* HEADER */}
        <div className="eventModalHeader">
          <h3>{isEdit ? "Update Event Details" : "Create New Event"}</h3>
          <button type="button" onClick={onClose} className="closeX">×</button>
        </div>

        {/* FORM WRAPPER */}
        <form className="eventModalForm" onSubmit={handleSubmit}>
          
          {/* BODY */}
          <div className="eventModalBody">
            <div className="formGroup">
              <label>Event Title</label>
              <input
                type="text"
                maxLength="100"
                placeholder="e.g. Annual Tech Hackathon 2026"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="eventRow">
              <div className="formGroup">
                <label>Event Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formGroup">
                <label>Start Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="formGroup">
              <label>Venue / Location</label>
              <input
                type="text"
                placeholder="e.g. Seminar Hall, Academic Block 1"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                required
              />
            </div>

            <div className="formGroup">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Freshers">Freshers</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Description</label>
              <textarea
                rows="4"
                placeholder="Describe the event objectives and details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="formGroup">
              <label>Event Poster</label>
              <div
                className="uploadPlaceholder"
                onClick={() => fileRef.current.click()}
              >
                {preview ? (
                  <img src={preview} alt="preview" className="eventPreview" />
                ) : (
                  <div className="uploadInner">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Click to upload event banner</span>
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
            </div>
          </div>

          {/* FOOTER */}
          <div className="eventModalFooter">
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="submitBtn"
              disabled={loading}
            >
              {loading ? "Processing..." : isEdit ? "Update Event" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}