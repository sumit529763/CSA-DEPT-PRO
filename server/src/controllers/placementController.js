const Placement = require("../models/Placement.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Helper: Uploads a file buffer to Cloudinary using a stream.
 * This is safer and cleaner than using temporary local files.
 */
const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: folder, 
        quality: "auto", 
        fetch_format: "auto" 
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ── GET ALL (Public) ────────────────────────────────
exports.getAllPlacements = async (req, res) => {
  try {
    const { batch, type, featured } = req.query;
    const filter = {};
    if (batch) filter.batch = batch;
    if (type) filter.type = type;
    if (featured) filter.isFeatured = true;

    const data = await Placement.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET ONE (Public) ────────────────────────────────
exports.getPlacementById = async (req, res) => {
  try {
    const item = await Placement.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Placement not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET STATS (Public) ──────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const total = await Placement.countDocuments();
    const companies = await Placement.distinct("company");
    const batches = await Placement.distinct("batch");
    const internships = await Placement.countDocuments({ type: "Internship" });
    const fulltime = await Placement.countDocuments({ type: "Full-Time" });

    res.json({
      success: true,
      data: {
        total,
        companies: companies.length,
        batches: batches.length,
        internships,
        fulltime,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── CREATE (Admin Only) ─────────────────────────────
exports.createPlacement = async (req, res) => {
  try {
    const {
      studentName, company, role, package: pkg,
      batch, type, testimonial, isFeatured,
    } = req.body;

    let photoUrl = "";
    let companyLogoUrl = "";

    // Upload Student Photo if exists
    if (req.files?.photo?.[0]) {
      const result = await uploadFromBuffer(req.files.photo[0].buffer, "csa-placements/students");
      photoUrl = result.secure_url;
    }

    // Upload Company Logo if exists
    if (req.files?.companyLogo?.[0]) {
      const result = await uploadFromBuffer(req.files.companyLogo[0].buffer, "csa-placements/logos");
      companyLogoUrl = result.secure_url;
    }

    const item = await Placement.create({
      studentName,
      company,
      role,
      package: pkg,
      batch,
      type,
      testimonial,
      isFeatured: isFeatured === "true" || isFeatured === true,
      photo: photoUrl,
      companyLogo: companyLogoUrl,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── UPDATE (Admin Only) ─────────────────────────────
exports.updatePlacement = async (req, res) => {
  try {
    const {
      studentName, company, role, package: pkg,
      batch, type, testimonial, isFeatured,
    } = req.body;

    // Prepare update object with text fields
    const updateData = {
      studentName,
      company,
      role,
      package: pkg,
      batch,
      type,
      testimonial,
      isFeatured: isFeatured === "true" || isFeatured === true,
    };

    // If a new photo is uploaded, process it
    if (req.files?.photo?.[0]) {
      const result = await uploadFromBuffer(req.files.photo[0].buffer, "csa-placements/students");
      updateData.photo = result.secure_url;
    }

    // If a new logo is uploaded, process it
    if (req.files?.companyLogo?.[0]) {
      const result = await uploadFromBuffer(req.files.companyLogo[0].buffer, "csa-placements/logos");
      updateData.companyLogo = result.secure_url;
    }

    const item = await Placement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ success: false, message: "Placement not found" });
    
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE (Admin Only) ─────────────────────────────
exports.deletePlacement = async (req, res) => {
  try {
    const item = await Placement.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Placement not found" });
    
    res.json({ success: true, message: "Placement deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};