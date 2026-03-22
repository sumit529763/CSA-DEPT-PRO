require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// // 🔥 Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/news", require("./routes/news.routes"));
app.use("/api/events", require("./routes/events.routes"));
app.use("/api/gallery", require("./routes/gallery.routes")); // ✅ added
app.use("/api/users", require("./routes/userRoutes")); // ✅ added

// Root route
app.get("/", (req, res) => {
  res.send("Backend running");
});

module.exports = app;