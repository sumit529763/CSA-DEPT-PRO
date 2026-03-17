const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // ================= VALIDATION =================
    if (!email || !password || !captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and captcha are required",
      });
    }

    // ================= CAPTCHA VERIFY =================
    const captchaVerifyURL = "https://www.google.com/recaptcha/api/siteverify";

    const captchaResponse = await axios.post(
      captchaVerifyURL,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed",
      });
    }

    // ================= FIND USER =================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ================= JWT TOKEN =================
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};