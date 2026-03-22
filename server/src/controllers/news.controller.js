const News = require("../models/News.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// 🔧 Helper: Upload buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "news",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ================= CREATE NEWS =================
exports.createNews = async (req, res) => {
  try {
    const { title, description, isPublished } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    let imageUrl = "";

    // ✅ FIXED: use buffer instead of path
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const news = await News.create({
      title,
      description,
      image: imageUrl,
      isPublished,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL NEWS =================
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({ isPublished: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE NEWS =================
exports.getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid News ID",
    });
  }
};

// ================= UPDATE NEWS =================
exports.updateNews = async (req, res) => {
  try {
    const newsId = req.params.id;

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // ✅ FIXED: handle image update properly
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      req.body.image = result.secure_url;
    }

    const updatedNews = await News.findByIdAndUpdate(
      newsId,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: updatedNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE NEWS =================
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};