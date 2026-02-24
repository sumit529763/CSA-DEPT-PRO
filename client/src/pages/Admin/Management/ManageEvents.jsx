import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageEvents.css";

export default function ManageEvents() {

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/events`;
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    description: ""
  });

  const [customCategory, setCustomCategory] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setEvents(res.data.data || []);
    } catch (error) {
      console.error("Fetch Events Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= CREATE EVENT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      form.category === "Other"
        ? customCategory.trim()
        : form.category;

    if (!form.title || !form.date || !form.time || !form.venue || !finalCategory || !form.description) {
      alert("Fill all fields");
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    data.set("category", finalCategory);
    if (image) data.append("image", image);

    try {
      setSubmitting(true);

      await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setShowModal(false);
      setForm({
        title: "",
        date: "",
        time: "",
        venue: "",
        category: "",
        description: ""
      });
      setImage(null);

      fetchEvents();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE EVENT =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete event?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchEvents();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="me-page">

      {/* HEADER */}
      <div className="me-header">
        <div>
          <h2>Manage Events</h2>
          <p>Create & manage department activities</p>
        </div>
        <button className="me-addBtn" onClick={() => setShowModal(true)}>
          + New Event
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="me-grid">

        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map(e => (
            <div className="me-card" key={e._id}>

              <div className="me-imgBox">

                {/* ✅ FIXED IMAGE */}
                <img
                  src={e.image || "https://via.placeholder.com/400x250?text=No+Image"}
                  alt={e.title}
                />

                <button
                  className="me-delete"
                  onClick={() => handleDelete(e._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>

              </div>

              <div className="me-body">
                <h4>{e.title}</h4>
                <p>{e.venue}</p>
                <span className="me-badge">{e.category}</span>

                <div className="me-footer">
                  {new Date(e.date).toLocaleDateString()} | {e.time}
                </div>
              </div>

            </div>
          ))
        )}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="me-modalOverlay">
          <div className="me-modal">

            <div className="me-modalHeader">
              <h3>Create Event</h3>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="me-form">

              <div className="me-bodyForm">

                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />

                <div className="me-row">
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                  <input
                    placeholder="Time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>

                <input
                  placeholder="Venue"
                  value={form.venue}
                  onChange={e => setForm({ ...form, venue: e.target.value })}
                />

                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Category</option>
                  <option>Hackathon</option>
                  <option>Workshop</option>
                  <option>Seminar</option>
                  <option>Freshers</option>
                  <option>Other</option>
                </select>

                {form.category === "Other" && (
                  <input
                    placeholder="Custom category"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                  />
                )}

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files[0])}
                />

              </div>

              <div className="me-footerForm">
                <button type="submit">
                  {submitting ? "Saving..." : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}