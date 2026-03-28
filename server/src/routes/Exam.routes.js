const express = require("express");
const router = express.Router();

const {
  createExamResource,
  updateExamResource,
  deleteExamResource,
  getByCategory,
  getAllExamResourcesAdmin,
  getSingleExamResource,
} = require("../controllers/Exam.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
// GET /api/exam                         → all published (optionally ?category=Schedules)
// GET /api/exam/:id                     → single resource
router.get("/", getByCategory);
router.get("/:id", getSingleExamResource);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
// GET /api/exam/admin/all               → all (includes unpublished)
router.get("/admin/all", protect, adminOnly, getAllExamResourcesAdmin);

// POST /api/exam                        → create
router.post("/", protect, adminOnly, upload.single("file"), createExamResource);

// PUT  /api/exam/:id                    → update
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("file"),
  updateExamResource
);

// DELETE /api/exam/:id                  → delete
router.delete("/:id", protect, adminOnly, deleteExamResource);

module.exports = router;