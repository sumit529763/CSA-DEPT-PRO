require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User.model"); // Ensure path is correct

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const email = "admin@giet.edu";

    // 1. Important: Check and delete existing to avoid old double-hashed passwords
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Removing old admin entry to reset password...");
      await User.deleteOne({ email });
    }

    // 2. Create the SuperAdmin with a PLAIN string password
    // The model's pre-save hook will hash "123456" for you!
    await User.create({
      name: "Department Admin",
      email: email,
      password: "123456", 
      role: "superadmin",
      designation: "Head of Department",
      bio: "Administrator for the CSA Department Website."
    });

    console.log("✅ SuperAdmin created successfully with password: 123456");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

createAdmin();