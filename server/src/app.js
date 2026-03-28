require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auditRoutes = require("./routes/audit.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images (legacy static, Cloudinary handles new uploads)
app.use("/uploads", express.static("uploads"));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/auth.routes"));
app.use("/api/test",    require("./routes/test.routes"));
app.use("/api/news",    require("./routes/news.routes"));
app.use("/api/events",  require("./routes/events.routes"));
app.use("/api/gallery", require("./routes/gallery.routes"));
app.use("/api/users",   require("./routes/userRoutes"));
app.use("/api/logs",    auditRoutes);

// ✅ NEW: Notices and Exam routes
app.use("/api/notices", require("./routes/Notice.routes"));
app.use("/api/exam",    require("./routes/Exam.routes"));

// Root health check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

module.exports = app;