const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth.controller");
// app.use("/api/test", require("./routes/test.routes"));

// ADMIN / SUPERADMIN LOGIN ONLY
router.post("/login", login);

module.exports = router;
