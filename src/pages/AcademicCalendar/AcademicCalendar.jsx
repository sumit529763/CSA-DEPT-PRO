import React from "react";
import "./AcademicCalendar.css";

const semesterDates = [
  { event: "Registration Commences", date: "August 01, 2025" },
  { event: "Classes Begin", date: "August 10, 2025" },
  { event: "Mid-Term Examinations", date: "October 15, 2025" },
  { event: "End-Term Examinations", date: "December 20, 2025" },
  { event: "Winter Break", date: "Dec 25 - Jan 05, 2026" },
];

export default function AcademicCalendar() {
  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Academic Calendar 2025-26</h2>
      <p className="calendar-subtitle">GIET University, Gunupur - CSA Department</p>
      
      <div className="table-wrapper">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Event Description</th>
              <th>Scheduled Date</th>
            </tr>
          </thead>
          <tbody>
            {semesterDates.map((item, index) => (
              <tr key={index}>
                <td>{item.event}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="download-section">
        <button className="download-btn">
          <i className="fas fa-file-pdf"></i> Download Full PDF
        </button>
      </div>
    </div>
  );
}