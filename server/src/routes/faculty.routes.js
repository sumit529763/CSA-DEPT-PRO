const express = require("express");
const router  = express.Router();
const {
  getFacultyPublic,
  getFacultyById,
} = require("../controllers/userController");

// ✅ Public routes only — no auth needed
router.get("/",    getFacultyPublic);
router.get("/:id", getFacultyById);

module.exports = router;