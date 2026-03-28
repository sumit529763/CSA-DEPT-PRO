const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logAction } = require("../middleware/logger");

exports.login = async (req, res) => {
  try {
    const { email, password, captchaAnswer, num1, num2 } = req.body;

    // 1. Validation
    if (!email || !password || captchaAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and captcha are required",
      });
    }

    // 2. Math Captcha Verification (Server-Side double check)
    if (parseInt(captchaAnswer) !== parseInt(num1) + parseInt(num2)) {
      return res.status(400).json({
        success: false,
        message: "Incorrect captcha answer. Please try again.",
      });
    }

    // 3. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Password Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✨ AUDIT LOG: Record the login after successful authentication
    await logAction(user._id, "LOGIN", `Admin logged into the system`, req);

    // 5. JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};