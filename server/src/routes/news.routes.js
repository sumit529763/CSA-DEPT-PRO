const express = require("express");
const router = express.Router();

const {
  createNews,
  getAllNews,
  getSingleNews,
  updateNews,
  deleteNews,
} = require("../controllers/news.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// 🔥 THIS MUST BE PRESENT
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // IMPORTANT
  createNews
);

router.get("/", getAllNews);
router.get("/:id", getSingleNews);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateNews
);

router.delete("/:id", protect, adminOnly, deleteNews);

module.exports = router;
