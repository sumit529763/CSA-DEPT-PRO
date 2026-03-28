const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    // ✅ FIXED: Added all action types actually used across every controller
    // If you add new action types in future controllers, add them here too
    enum: [
      // User management
      "CREATE_USER",
      "UPDATE_USER",
      "DELETE_USER",

      // Auth
      "LOGIN",
      "LOGOUT",

      // News
      "CREATE_NEWS",
      "UPDATE_NEWS",
      "DELETE_NEWS",

      // Events
      "CREATE_EVENT",
      "UPDATE_EVENT",
      "DELETE_EVENT",

      // Gallery
      "UPLOAD_GALLERY",
      "DELETE_GALLERY",

      // Notices  ← NEW
      "CREATE_NOTICE",
      "UPDATE_NOTICE",
      "DELETE_NOTICE",

      // Exam resources  ← NEW
      "CREATE_EXAM_RESOURCE",
      "UPDATE_EXAM_RESOURCE",
      "DELETE_EXAM_RESOURCE",
    ],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  details: {
    type: String,
  },

  ipAddress: {
    type: String,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);