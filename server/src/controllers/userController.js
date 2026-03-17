const User = require("../models/User.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


// ================================
// CREATE ADMIN (SuperAdmin only)
// ================================
exports.createUser = async (req, res) => {
  try {
    const { name, designation, bio, research, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    let photoUrl = "";

    // ================================
    // Upload image to Cloudinary
    // ================================
    if (req.file) {

      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);

        });

      const result = await uploadFromBuffer();
      photoUrl = result.secure_url;
    }

    // ================================
    // Create Admin User
    // ================================
    const user = await User.create({
      name,
      designation,
      bio,
      research,
      email,
      password, // model will hash automatically
      photo: photoUrl,
      role: "admin"
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: userResponse
    });

  } catch (error) {

    console.error("CREATE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================================
// GET ALL ADMINS
// ================================
exports.getUsers = async (req, res) => {
  try {

    const users = await User.find({ role: "admin" }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {

    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================================
// DELETE USER
// ================================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    // Prevent deleting superadmin
    if (user.role === "superadmin") {
      return res.status(400).json({
        success: false,
        message: "SuperAdmin cannot be deleted"
      });
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.updateUser = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, designation, bio, research, email } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update fields
    user.name = name || user.name;
    user.designation = designation || user.designation;
    user.bio = bio || user.bio;
    user.research = research || user.research;
    user.email = email || user.email;

    // If new photo uploaded
    if (req.file) {
      user.photo = req.file.path;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};