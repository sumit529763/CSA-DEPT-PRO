const multer = require("multer");

// Use memoryStorage so req.file.buffer is available for Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images AND PDFs (for notice/exam attachments)
  const allowed =
    file.mimetype.startsWith("image") ||
    file.mimetype === "application/pdf";

  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

module.exports = upload;