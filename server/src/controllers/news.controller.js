const News = require("../models/News.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

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

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "news",
        quality: "auto",
        fetch_format: "auto",
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // remove temp file
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
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

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
