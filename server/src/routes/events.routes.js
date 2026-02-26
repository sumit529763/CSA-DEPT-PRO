const express = require("express");
const router = express.Router();

/* Controllers */
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/events.controller");

/* Middleware */
// ✅ FIXED IMPORT
const { protect, adminOnly } = require("../middleware/auth.middleware");

// ✅ Upload middleware
const upload = require("../middleware/upload.middleware");

/**
 * ===============================
 * PUBLIC ROUTES
 * ===============================
 */

// 🔓 Get all events
router.get("/", getAllEvents);

/**
 * ===============================
 * ADMIN / SUPER ADMIN ROUTES
 * ===============================
 */

// 🔐 Create event
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createEvent
);

// 🔐 Update event
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateEvent
);

// 🔐 Delete event
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

module.exports = router;