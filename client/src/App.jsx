// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import PublicLayout from "./components/Routes/PublicLayout.jsx";
import AdminLayout from "./pages/Admin/Dashboard/AdminLayout.jsx";

/* Guards */
import ProtectedRoute from "./components/Routes/ProtectedRoute.jsx";

/* Public Pages */
import Home from "./pages/Home/Home.jsx";
import Alumini from "./pages/Alumini/Alumini.jsx";
import Events from "./pages/Events/Events.jsx";
import Exam from "./pages/Exam/Exam.jsx";
import Faculty from "./pages/Faculty/Faculty.jsx";
import Gallery from "./pages/Gallery/Gallery.jsx";
import News from "./pages/News/News.jsx";
import Notices from "./pages/Notices/Notices.jsx";
import Placement from "./pages/Placement/Placement.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Calendar from "./pages/AcademicCalendar/AcademicCalendar.jsx";
import Login from "./pages/Login/Login.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

/* Admin Pages */
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.jsx";
import ManageNews from "./pages/Admin/Management/ManageNews.jsx";
import AddNews from "./pages/Admin/Management/AddNews.jsx";
import EditNews from "./pages/Admin/Management/EditNews.jsx";

import ManageEvents from "./pages/Admin/Management/ManageEvents.jsx";
import ManageGallery from "./pages/Admin/Management/ManageGallery.jsx";

/* Super Admin Pages */
import ManageUsers from "./pages/Admin/SuperAdmin/ManageUsers.jsx";
import AuditLogs from "./pages/Admin/SuperAdmin/AuditLogs.jsx";

export default function App() {
  return (
    <Routes>
      {/* ===== PUBLIC WEBSITE ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/alumni" element={<Alumini />} />
        <Route path="/events" element={<Events />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/placements" element={<Placement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ===== ADMIN PANEL ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* Default Admin Route */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Content Management */}
        <Route path="manage/news" element={<ManageNews />} />
        <Route path="manage/news/add" element={<AddNews />} />
        <Route path="manage/news/edit/:id" element={<EditNews />} />

        <Route path="manage/events" element={<ManageEvents />} />
        <Route path="manage/gallery" element={<ManageGallery />} />


        {/* Super Admin Section */}
        {/* This line fixes the 404: If someone goes to /admin/super, it sends them to /admin/super/users */}
        <Route path="super" element={<Navigate to="users" replace />} />
        <Route path="super/users" element={<ManageUsers />} />
        <Route path="super/audit" element={<AuditLogs />} />
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
