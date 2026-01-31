const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You have access to protected route",
    user: req.user
  });
});

module.exports = router;
