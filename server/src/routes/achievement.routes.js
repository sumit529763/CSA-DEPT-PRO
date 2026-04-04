const express = require("express");
const router  = express.Router();
const {
  createAchievement, updateAchievement, deleteAchievement,
  getAllAchievements, getYears, getAllAdmin,
} = require("../controllers/achievement.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/",        getAllAchievements);
router.get("/years",   getYears);

// Admin
router.get("/admin/all",  protect, adminOnly, getAllAdmin);
router.post("/",          protect, adminOnly, upload.single("image"), createAchievement);
router.put("/:id",        protect, adminOnly, upload.single("image"), updateAchievement);
router.delete("/:id",     protect, adminOnly, deleteAchievement);

module.exports = router;