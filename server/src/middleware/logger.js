const AuditLog = require('../models/AuditLog.model');

/**
 * @param {String} userId - ID of the admin performing the action
 * @param {String} action - The type of action (e.g. DELETE_USER)
 * @param {String} details - Description of what happened
 * @param {Object} req - The request object to extract IP
 */
const logAction = async (userId, action, details, req) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    await AuditLog.create({
      user: userId,
      action,
      details,
      ipAddress: ip
    });
    
    console.log(`[AUDIT LOG]: ${action} by User ${userId}`);
  } catch (err) {
    console.error("CRITICAL: Audit Log Failed:", err);
  }
};

module.exports = { logAction };