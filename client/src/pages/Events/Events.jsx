import React, { useState, useEffect } from "react";
import axios from "axios";
import SectionTitle from "../../components/UI/SectionTitle";
import Card from "../../components/UI/Card";
import "./Events.css";

export default function Events() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/events`;

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setEvents(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

  }, []);

  const getStatus = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);

    const eventDate = new Date(date);
    eventDate.setHours(0,0,0,0);

    return eventDate < today ? "Past" : "Upcoming";
  };

  return (
    <div className="events-page container section-padding">

      <SectionTitle
        title="Departmental Events"
        subtitle="Experience innovation through workshops, hackathons & seminars"
      />

      <div className="events-grid">

        {loading ? (

          [1,2,3].map(n => (
            <Card key={n} className="event-card skeleton-card">
              <div className="skeleton ev-img-sk"></div>
              <div className="event-content">
                <div className="skeleton sk-text"></div>
                <div className="skeleton sk-text"></div>
                <div className="skeleton sk-button"></div>
              </div>
            </Card>
          ))

        ) : events.length > 0 ? (

          events.map(event => {

            const status = getStatus(event.date);

            return (
              <Card
                key={event._id}
                className={`event-card ${status.toLowerCase()}`}
              >

                {/* IMAGE */}
                <div className="event-img-box">

                  <img
                    src={
                      event.image
                        ? event.image
                        : "https://via.placeholder.com/400x250?text=Event"
                    }
                    alt={event.title}
                  />

                  <span className="event-badge">
                    {event.category}
                  </span>

                </div>

                {/* CONTENT */}
                <div className="event-content">

                  <div className="event-date-tag">
                    <span className="ev-month">
                      {new Date(event.date).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>

                    <span className="ev-day">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  <div className="event-main-info">

                    <h3 className="event-title">
                      {event.title}
                    </h3>

                    <p className="event-desc">
                      {event.description}
                    </p>

                    <div className="event-details-list">
                      <span>
                        <i className="far fa-clock"></i>
                        {" "} {event.time}
                      </span>

                      <span>
                        <i className="fas fa-map-marker-alt"></i>
                        {" "} {event.venue}
                      </span>
                    </div>

                    <button
                      className={`btn-event ${
                        status === "Past" ? "btn-disabled" : ""
                      }`}
                      disabled={status === "Past"}
                    >
                      {status === "Past"
                        ? "Event Completed"
                        : "Register Now"}
                    </button>

                  </div>

                </div>

              </Card>
            );
          })

        ) : (
          <p style={{ textAlign: "center" }}>
            No events available.
          </p>
        )}

      </div>

    </div>
  );
}