const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      "LOGIN",
      "LOGOUT",

      "CREATE_USER",
      "UPDATE_USER",
      "DELETE_USER",

      "CREATE_NEWS",
      "UPDATE_NEWS",
      "DELETE_NEWS",

      "CREATE_EVENT",
      "UPDATE_EVENT",
      "DELETE_EVENT",

      "UPLOAD_GALLERY",
      "DELETE_GALLERY",

      "CREATE_NOTICE",
      "UPDATE_NOTICE",
      "DELETE_NOTICE",

      "CREATE_EXAM_RESOURCE",
      "UPDATE_EXAM_RESOURCE",
      "DELETE_EXAM_RESOURCE",

      "CREATE_ACHIEVEMENT",
      "UPDATE_ACHIEVEMENT",
      "DELETE_ACHIEVEMENT",

      "CREATE_ALUMNI",
      "UPDATE_ALUMNI",
      "DELETE_ALUMNI",

      "CREATE_PLACEMENT",
      "UPDATE_PLACEMENT",
      "DELETE_PLACEMENT",
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