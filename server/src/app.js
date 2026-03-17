require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://csa-dept-pro.web.app",
  "https://csa-dept-pro.firebaseapp.com"
];

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

/* ROUTES */
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