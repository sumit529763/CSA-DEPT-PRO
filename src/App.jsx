// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Alumini from "./pages/Alumini/Alumini.jsx";
import Events from "./pages/Events/Events.jsx";
import Exam from "./pages/Exam/Exam.jsx";
import Faculty from "./pages/Faculty/Faculty.jsx";
import Gallery from "./pages/Gallery/Gallery.jsx";
import Login from "./pages/Login/Login.jsx";
import News from "./pages/News/News.jsx";
import Notices from "./pages/Notices/Notices.jsx";
import Placement from "./pages/Placement/Placement.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Calendar from "./pages/AcademicCalendar/AcademicCalendar.jsx"

import Home from "./pages/Home/Home.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumni" element={<Alumini />} />
          <Route path="/events" element={<Events />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/news" element={<News />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/placements" element={<Placement />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
