const express = require("express");
const router = express.Router();

const {
  createNotice,
  updateNotice,
  deleteNotice,
  getAllNotices,
  getAllNoticesAdmin,
  getSingleNotice,
} = require("../controllers/Notice.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
// GET /api/notices           → all published notices (optional ?type=Exam)
router.get("/", getAllNotices);
router.get("/:id", getSingleNotice);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
// GET /api/notices/admin/all → includes unpublished (for ManageNotices page)
router.get("/admin/all", protect, adminOnly, getAllNoticesAdmin);

// POST /api/notices          → create a new notice (supports file upload)
router.post("/", protect, adminOnly, upload.single("file"), createNotice);

// PUT /api/notices/:id       → update
router.put("/:id", protect, adminOnly, upload.single("file"), updateNotice);

// DELETE /api/notices/:id    → delete
router.delete("/:id", protect, adminOnly, deleteNotice);

module.exports = router;