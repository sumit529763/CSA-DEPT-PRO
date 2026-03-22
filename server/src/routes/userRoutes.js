const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const { protect, isSuperAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// SuperAdmin only routes
router.post("/create", protect, isSuperAdmin, upload.single("photo"), createUser);
router.get("/", protect, isSuperAdmin, getUsers);
router.delete("/:id", protect, isSuperAdmin, deleteUser);
router.put("/:id", protect, isSuperAdmin, upload.single("photo"), updateUser);

module.exports = router;