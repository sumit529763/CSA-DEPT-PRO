const express = require("express");
const router  = express.Router();
const {
  createAlumni, updateAlumni, deleteAlumni,
  getAllAlumni, getYears, getAllAdmin,
} = require("../controllers/alumni.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/",          getAllAlumni);
router.get("/years",     getYears);

// Admin
router.get("/admin/all", protect, adminOnly, getAllAdmin);
router.post("/",         protect, adminOnly, upload.single("photo"), createAlumni);
router.put("/:id",       protect, adminOnly, upload.single("photo"), updateAlumni);
router.delete("/:id",    protect, adminOnly, deleteAlumni);

module.exports = router;