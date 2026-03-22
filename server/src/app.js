require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

<<<<<<<<< Temporary merge branch 1
// ✅ Allowed Origins
=========
// Allowed Origins
>>>>>>>>> Temporary merge branch 2
const allowedOrigins = [
  "http://localhost:5173",
  "https://csa-dept-pro.web.app",
  "https://csa-dept-pro.firebaseapp.com"
];

<<<<<<<<< Temporary merge branch 1
=========
// CORS Middleware
>>>>>>>>> Temporary merge branch 2
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

<<<<<<<<< Temporary merge branch 1
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
=========
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
>>>>>>>>> Temporary merge branch 2
      }
    },
    credentials: true,
  })
);

app.use(express.json());

<<<<<<<<< Temporary merge branch 1
// Serve uploaded images (if needed)
app.use("/uploads", express.static("uploads"));

// Routes
=========
// Serve uploaded images
app.use("/uploads", express.static("uploads"));

/* ROUTES */
>>>>>>>>> Temporary merge branch 2
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