const multer = require("multer");

// 🟢 FIX: Use memoryStorage so req.file.buffer is available for Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;