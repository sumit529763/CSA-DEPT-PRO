const express = require("express");
const router = express.Router();
const {
  login,
  getMe,
  updateProfile,
  updatePassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// ── Public ──
router.post("/login", login);

// ── Protected ──
router.get("/me",             protect,                        getMe);
router.put("/update-profile", protect, upload.single("photo"), updateProfile);
router.put("/update-password", protect,                        updatePassword);

module.exports = router;