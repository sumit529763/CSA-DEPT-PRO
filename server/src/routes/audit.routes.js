const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/audit.controller");

// Notice the names here match your middleware file exactly
const { protect, isSuperAdmin } = require("../middleware/auth.middleware");

// GET /api/logs - Protected and restricted to SuperAdmin
// We use isSuperAdmin because regular admins shouldn't see their own tracks!
router.get("/", protect, isSuperAdmin, getAuditLogs);

module.exports = router;