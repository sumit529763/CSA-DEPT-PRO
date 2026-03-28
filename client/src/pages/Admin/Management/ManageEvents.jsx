import React, { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./EventForm";
import "./ManageEvents.css";

const CATEGORIES = ["Academic", "Cultural", "Sports", "Technical", "Workshop", "Other"];

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }) : "—";

const isUpcoming = (d) => d && new Date(d) >= new Date();

export default function ManageEvents() {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/events`;

  const [events, setEvents]               = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [isEditMode, setIsEditMode]       = useState(false);
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "", date: "", time: "", venue: "",
    category: "", description: "", id: null,
  });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    let temp = [...events];
    if (activeCategory !== "All")
      temp = temp.filter((e) => e.category === activeCategory);
    if (search)
      temp = temp.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue?.toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(temp);
  }, [search, events, activeCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data  = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "id" && formData[key]) data.append(key, formData[key]);
    });
    if (image) data.append("image", image);
    try {
      setLoadingAction(true);
      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      };
      if (isEditMode) await axios.put(`${API_URL}/${formData.id}`, data, config);
      else            await axios.post(API_URL, data, config);
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save event.");
    } finally {
      setLoadingAction(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ title: "", date: "", time: "", venue: "", category: "", description: "", id: null });
    setPreview("");
    setImage(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setIsEditMode(true);
    setFormData({
      title: event.title, date: event.date?.split("T")[0] || "",
      time: event.time, venue: event.venue,
      category: event.category, description: event.description,
      id: event._id,
    });
    setPreview(event.image);
    setImage(null);
    setShowModal(true);
  };

  const deleteEvent = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  const upcomingCount = events.filter((e) => isUpcoming(e.date)).length;
  const categoryCount = (cat) =>
    cat === "All" ? events.length : events.filter((e) => e.category === cat).length;

  return (
    <div className="events-page">

      {/* HEADER */}
      <div className="events-header">
        <div>
          <h2>Manage Events</h2>
          <p>Create, update and manage department events</p>
        </div>
        <button className="events-add-btn" onClick={openAddModal}>
          <i className="fas fa-plus" />
          <span>Add Event</span>
        </button>
      </div>

      {/* STATS */}
      <div className="events-stats">
        <div className="events-stat">
          <i className="fas fa-calendar-alt events-stat-icon" />
          <div className="events-stat-info">
            <span className="events-stat-num">{events.length}</span>
            <span className="events-stat-label">Total Events</span>
          </div>
        </div>
        <div className="events-stat">
          <i className="fas fa-rocket events-stat-icon" />
          <div className="events-stat-info">
            <span className="events-stat-num">{upcomingCount}</span>
            <span className="events-stat-label">Upcoming</span>
          </div>
        </div>
        <div className="events-stat">
          <i className="fas fa-layer-group events-stat-icon" />
          <div className="events-stat-info">
            <span className="events-stat-num">
              {[...new Set(events.map((e) => e.category).filter(Boolean))].length}
            </span>
            <span className="events-stat-label">Categories</span>
          </div>
        </div>
        <div className="events-stat">
          <i className="fas fa-filter events-stat-icon" />
          <div className="events-stat-info">
            <span className="events-stat-num">{filtered.length}</span>
            <span className="events-stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="events-tabs">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`events-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => { setActiveCategory(cat); setSearch(""); }}
          >
            <span>{cat}</span>
            <span className="events-tab-count">{categoryCount(cat)}</span>
          </button>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="events-toolbar">
        <div className="events-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by title or venue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="events-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        {!loading && (
          <p className="events-count">
            <strong>{filtered.length}</strong> event{filtered.length !== 1 ? "s" : ""}
            {search && <span> matching "<strong>{search}</strong>"</span>}
          </p>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="events-skeletons">
          {[1,2,3,4,5,6].map((n) => (
            <div key={n} className="events-skeleton-card">
              <div className="esk esk-img" />
              <div className="esk-body">
                <div className="esk esk-title" />
                <div className="esk esk-line" />
                <div className="esk esk-badge" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="events-empty">
          <i className="fas fa-calendar-times" />
          <h4>No Events Found</h4>
          <p>
            {search
              ? `No results for "${search}"`
              : 'Click "Add Event" to create your first event'}
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map((event, idx) => (
            <div className="event-card" key={event._id}>

              {/* IMAGE */}
              <div className="ec-image">
                <img
                  src={event.image || "https://placehold.co/400x200/e8edff/2554f0?text=No+Image"}
                  alt={event.title}
                />
                <div className="ec-index">#{idx + 1}</div>

                {/* UPCOMING / PAST BADGE */}
                <span className={`ec-status-badge ${isUpcoming(event.date) ? "upcoming" : "past"}`}>
                  {isUpcoming(event.date) ? "Upcoming" : "Past"}
                </span>

                {/* HOVER OVERLAY */}
                <div className="ec-overlay">
                  <button className="ec-btn-edit" onClick={() => openEditModal(event)}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  <button className="ec-btn-delete" onClick={() => deleteEvent(event._id, event.title)}>
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="ec-body">
                <p className="ec-title">{event.title}</p>

                <div className="ec-meta">
                  {event.date && (
                    <span className="ec-meta-item">
                      <i className="fas fa-calendar-alt" /> {formatDate(event.date)}
                    </span>
                  )}
                  {event.time && (
                    <span className="ec-meta-item">
                      <i className="fas fa-clock" /> {event.time}
                    </span>
                  )}
                  {event.venue && (
                    <span className="ec-meta-item">
                      <i className="fas fa-map-marker-alt" /> {event.venue}
                    </span>
                  )}
                </div>

                <div className="ec-footer">
                  {event.category && (
                    <span className="ec-cat-tag">{event.category}</span>
                  )}
                  <div className="ec-actions">
                    <button className="exam-btn-edit" onClick={() => openEditModal(event)}>
                      <i className="fas fa-edit" /> <span>Edit</span>
                    </button>
                    <button className="exam-btn-delete" onClick={() => deleteEvent(event._id, event.title)}>
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <EventForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
        loading={loadingAction}
        formData={formData}
        setFormData={setFormData}
        preview={preview}
        onImageChange={(e) => {
          const f = e.target.files[0];
          if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
        }}
      />
    </div>
  );
}