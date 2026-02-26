require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User.model");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "sumit@giet.edu";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("1234", 10);

    await User.create({
      name: "Department Admin",
      email,
      password: hashedPassword,
      role: "superadmin"
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
