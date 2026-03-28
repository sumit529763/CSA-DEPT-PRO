const AuditLog = require("../models/AuditLog.model");

// GET all audit logs (Sorted by newest first)
exports.getAuditLogs = async (req, res) => {
  try {
    // .populate('user', 'name email') joins the User model to show the Admin's name
    const logs = await AuditLog.find()
      .populate("user", "name email") 
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch audit logs",
      error: error.message,
    });
  }
};