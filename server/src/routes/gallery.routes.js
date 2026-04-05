const express = require("express");
const router = express.Router();

const {
  createGalleryItem,
  getAllGallery,
  deleteGalleryItem
} = require("../controllers/gallery.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// GET all gallery images
router.get("/", getAllGallery);

// ADD gallery image
router.post("/", protect, adminOnly, upload.single("image"), createGalleryItem);

// DELETE gallery image
router.delete("/:id", protect, adminOnly, deleteGalleryItem);

module.exports = router;