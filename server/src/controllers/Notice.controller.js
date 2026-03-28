const Notice = require("../models/Notice.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { logAction } = require("../middleware/logger");

// 🔧 Helper: Upload buffer to Cloudinary (raw file / PDF)
const uploadFileFromBuffer = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const isImage = mimetype.startsWith("image");
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "notices",
        resource_type: isImage ? "image" : "raw", // "raw" handles PDFs
        quality: isImage ? "auto" : undefined,
        fetch_format: isImage ? "auto" : undefined,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ================= CREATE NOTICE =================
exports.createNotice = async (req, res) => {
  try {
    const { title, date, type, isUrgent, isPublished } = req.body;

    if (!title || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Title and type are required" });
    }

    let fileUrl = "";
    let filePublicId = "";

    if (req.file) {
      const result = await uploadFileFromBuffer(
        req.file.buffer,
        req.file.mimetype
      );
      fileUrl = result.secure_url;
      filePublicId = result.public_id;
    }

    const notice = await Notice.create({
      title,
      date: date || Date.now(),
      type,
      isUrgent: isUrgent === "true" || isUrgent === true,
      fileUrl,
      filePublicId,
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: req.user?._id,
    });

    await logAction(
      req.user._id,
      "CREATE_NOTICE",
      `Posted Notice: ${title}`,
      req
    );

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE NOTICE =================
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice)
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });

    if (req.file) {
      // Delete old file from Cloudinary if it exists
      if (notice.filePublicId) {
        await cloudinary.uploader.destroy(notice.filePublicId, {
          resource_type: "raw",
        });
      }
      const result = await uploadFileFromBuffer(
        req.file.buffer,
        req.file.mimetype
      );
      req.body.fileUrl = result.secure_url;
      req.body.filePublicId = result.public_id;
    }

    // Handle boolean fields from form data (strings)
    if (req.body.isUrgent !== undefined) {
      req.body.isUrgent =
        req.body.isUrgent === "true" || req.body.isUrgent === true;
    }
    if (req.body.isPublished !== undefined) {
      req.body.isPublished =
        req.body.isPublished === "true" || req.body.isPublished === true;
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await logAction(
      req.user._id,
      "UPDATE_NOTICE",
      `Updated Notice: ${updatedNotice.title}`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: updatedNotice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE NOTICE =================
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice)
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });

    // Delete attached file from Cloudinary
    if (notice.filePublicId) {
      await cloudinary.uploader.destroy(notice.filePublicId, {
        resource_type: "raw",
      });
    }

    const noticeTitle = notice.title;
    await notice.deleteOne();

    await logAction(
      req.user._id,
      "DELETE_NOTICE",
      `Deleted Notice: ${noticeTitle}`,
      req
    );

    res
      .status(200)
      .json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL NOTICES (Public) =================
exports.getAllNotices = async (req, res) => {
  try {
    const filter = { isPublished: true };

    // Optional filter by type: GET /api/notices?type=Exam
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const notices = await Notice.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL NOTICES for Admin (includes unpublished) =================
exports.getAllNoticesAdmin = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE NOTICE =================
exports.getSingleNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice)
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Notice ID" });
  }
};