const express = require("express");
const router  = express.Router();
const {
  getAllPlacements,
  getPlacementById,
  getStats,
  createPlacement,
  updatePlacement,
  deletePlacement,
} = require("../controllers/placementController");
const { protect, isSuperAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const multiUpload = upload.fields([
  { name: "photo",       maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
]);

// Public
router.get("/",         getAllPlacements);
router.get("/stats",    getStats);
router.get("/:id",      getPlacementById);

// Admin
router.post(  "/",    protect, isSuperAdmin, multiUpload, createPlacement);
router.put(   "/:id", protect, isSuperAdmin, multiUpload, updatePlacement);
router.delete("/:id", protect, isSuperAdmin,              deletePlacement);

module.exports = router;