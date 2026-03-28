const ExamResource = require("../models/Examresource.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { logAction } = require("../middleware/logger");

// 🔧 Helper: Upload any file buffer to Cloudinary
const uploadFileFromBuffer = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const isImage = mimetype.startsWith("image");
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "exam",
        resource_type: isImage ? "image" : "raw",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ================= CREATE EXAM RESOURCE =================
exports.createExamResource = async (req, res) => {
  try {
    const {
      category,
      title,
      examDate,
      code,
      releaseDate,
      resourceType,
      fileUrl: bodyFileUrl,
      isPublished,
    } = req.body;

    if (!category || !title) {
      return res
        .status(400)
        .json({ success: false, message: "Category and title are required" });
    }

    let fileUrl = bodyFileUrl || "";
    let filePublicId = "";

    // Upload file only if one was sent (PDF timetable, result PDF, etc.)
    if (req.file) {
      const result = await uploadFileFromBuffer(
        req.file.buffer,
        req.file.mimetype
      );
      fileUrl = result.secure_url;
      filePublicId = result.public_id;
    }

    const resource = await ExamResource.create({
      category,
      title,
      examDate: examDate || null,
      code: code || "",
      releaseDate: releaseDate || null,
      resourceType: resourceType || "",
      fileUrl,
      filePublicId,
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: req.user?._id,
    });

    await logAction(
      req.user._id,
      "CREATE_EXAM_RESOURCE",
      `Posted Exam ${category}: ${title}`,
      req
    );

    res.status(201).json({
      success: true,
      message: "Exam resource created successfully",
      data: resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE EXAM RESOURCE =================
exports.updateExamResource = async (req, res) => {
  try {
    const resource = await ExamResource.findById(req.params.id);
    if (!resource)
      return res
        .status(404)
        .json({ success: false, message: "Exam resource not found" });

    if (req.file) {
      if (resource.filePublicId) {
        await cloudinary.uploader.destroy(resource.filePublicId, {
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

    const updated = await ExamResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await logAction(
      req.user._id,
      "UPDATE_EXAM_RESOURCE",
      `Updated Exam ${updated.category}: ${updated.title}`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Exam resource updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE EXAM RESOURCE =================
exports.deleteExamResource = async (req, res) => {
  try {
    const resource = await ExamResource.findById(req.params.id);
    if (!resource)
      return res
        .status(404)
        .json({ success: false, message: "Exam resource not found" });

    if (resource.filePublicId) {
      await cloudinary.uploader.destroy(resource.filePublicId, {
        resource_type: "raw",
      });
    }

    const label = `${resource.category}: ${resource.title}`;
    await resource.deleteOne();

    await logAction(
      req.user._id,
      "DELETE_EXAM_RESOURCE",
      `Deleted Exam ${label}`,
      req
    );

    res
      .status(200)
      .json({ success: true, message: "Exam resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET BY CATEGORY (Public) =================
// GET /api/exam?category=Schedules
exports.getByCategory = async (req, res) => {
  try {
    const filter = { isPublished: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const resources = await ExamResource.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL (Admin — includes unpublished) =================
exports.getAllExamResourcesAdmin = async (req, res) => {
  try {
    const resources = await ExamResource.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE =================
exports.getSingleExamResource = async (req, res) => {
  try {
    const resource = await ExamResource.findById(req.params.id);
    if (!resource)
      return res
        .status(404)
        .json({ success: false, message: "Exam resource not found" });
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid ID" });
  }
};