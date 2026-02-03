const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Existing routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));

// ✅ ADD THIS LINE (News routes)
app.use("/api/news", require("./routes/news.routes"));

app.get("/", (req, res) => {
  res.send("Backend running");
});

module.exports = app;
