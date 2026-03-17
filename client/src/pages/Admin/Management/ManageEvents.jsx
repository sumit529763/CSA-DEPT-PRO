import React, { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./EventForm";
import "./ManageEvents.css";

export default function ManageEvents() {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/events`;
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "", date: "", time: "", venue: "", category: "", description: "", id: null
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setEvents(res.data.data || []);
      setFilteredEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredEvents(filtered);
  }, [search, events]);

  // Fix for 401 error: Added proper Authorization header
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'id' && formData[key]) data.append(key, formData[key]);
    });
    if (image) data.append("image", image);

    try {
      setLoadingAction(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure space
          "Content-Type": "multipart/form-data"
        }
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/${formData.id}`, data, config);
      } else {
        await axios.post(API_URL, data, config);
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to save event. You might need to log in again.");
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
      title: event.title,
      date: event.date.split("T")[0],
      time: event.time,
      venue: event.venue,
      category: event.category,
      description: event.description,
      id: event._id
    });
    setPreview(event.image);
    setImage(null);
    setShowModal(true);
  };

  const deleteEvent = async (id) => {
    if(!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="manageEventsPage">
      <div className="eventsHeader">
        <div>
          <h2>Manage Events</h2>
          <p>Create, update and manage department events</p>
        </div>
        <button className="addEventBtn" onClick={openAddModal}>+ Add Event</button>
      </div>
      <div className="eventsTools">
        <input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="loadingBox">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="emptyBox">
          <h4>No Events Created</h4>
          <p>Click Add Event to create your first event</p>
        </div>
      ) : (
        <div className="eventsGrid">
          {filteredEvents.map(event => (
            <div className="eventCard" key={event._id}>
              <div className="eventImage">
                <img src={event.image || "https://via.placeholder.com/400"} alt={event.title} />
                <div className="eventOverlay">
                  <button onClick={() => openEditModal(event)}><i className="fas fa-edit"></i></button>
                  <button className="delete" onClick={() => deleteEvent(event._id)}><i className="fas fa-trash"></i></button>
                </div>
              </div>
              <div className="eventCardBody">
                <h4>{event.title}</h4>
                <p>{event.venue}</p>
                <span className="eventBadge">{event.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
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
          const file = e.target.files[0];
          if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}