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
import FacultyDetails from "./pages/Faculty/FacultyDetails.jsx";

/* Admin Pages */
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.jsx";
import Profile from "./pages/Admin/Dashboard/Profile.jsx";
import ManageNews from "./pages/Admin/Management/ManageNews.jsx";
import ManageEvents from "./pages/Admin/Management/ManageEvents.jsx";
import ManageGallery from "./pages/Admin/Management/ManageGallery.jsx";
import ManageNotices from "./pages/Admin/Management/Managenotices.jsx";
import ManageExam from "./pages/Admin/Management/Manageexam.jsx";
import ManagePlacements from "./pages/Admin/Management/ManagePlacements";

/* Super Admin Pages */
import ManageUsers from "./pages/Admin/SuperAdmin/ManageUsers.jsx";
import AuditLogs from "./pages/Admin/SuperAdmin/AuditLogs.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Routes>
        {/* ===== PUBLIC WEBSITE ===== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/alumni" element={<Alumini />} />
          <Route path="/events" element={<Events />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/faculty/:id" element={<FacultyDetails />} />
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
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Core — any admin */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />

          {/* Content Management — any admin */}
          <Route path="manage/news" element={<ManageNews />} />
          <Route path="manage/events" element={<ManageEvents />} />
          <Route path="manage/gallery" element={<ManageGallery />} />
          <Route path="manage/notices" element={<ManageNotices />} />
          <Route path="manage/exam" element={<ManageExam />} />
          <Route path="manage/placements" element={<ManagePlacements />} />

          {/* Super Admin only */}
          <Route path="super" element={<Navigate to="users" replace />} />
          <Route
            path="super/users"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="super/audit"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <AuditLogs />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>
  );
}
