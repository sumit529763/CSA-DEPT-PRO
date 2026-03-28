// server/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");
const { protect, isSuperAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(protect);
router.use(isSuperAdmin);

router.get("/",                                getUsers);
router.post("/create", upload.single("photo"), createUser);
router.put("/:id",     upload.single("photo"), updateUser);
router.delete("/:id",                          deleteUser);
router.patch("/:id/toggle",                    toggleUserStatus);

module.exports = router;