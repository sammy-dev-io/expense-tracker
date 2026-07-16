// This controller handles the two entry points to becoming "logged in":
// registering a brand new account, and logging into an existing one.

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Small helper - creates a signed token containing the user's id.
// We'll use this same helper for both register and login, since both
// end with "the user is now logged in, give them a token."
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // the "payload" - data embedded inside the token
    process.env.JWT_SECRET, // the secret key that signs it, so it can't be forged
    { expiresIn: "7d" } // token stops working after 7 days - they'd need to log in again
  );
};

// REGISTER - create a brand new account
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are all required",
      });
    }

    // Basic email format check - not perfect (no regex can PERFECTLY validate
    // every real email address), but catches obvious mistakes like missing
    // "@" or missing domain. This does NOT confirm the email actually exists
    // or is reachable - only that it's shaped like a real email.
    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRule.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Password rule: at least 8 characters, at least one letter, at least
    // one number. This regex uses "lookaheads" - (?=...) checks a condition
    // exists somewhere ahead, without consuming characters itself.
    const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRule.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include at least one letter and one number",
      });
    }

    // Check if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash (scramble) the password before storing it.
    // "10" is the "salt rounds" - roughly how much computational effort
    // goes into the scrambling. 10 is a well-tested, reasonable default.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword, // we save the SCRAMBLED version, never the real one
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN - verify credentials for an existing account
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Deliberately vague on purpose - we don't want to reveal to an
      // attacker WHICH part was wrong (email vs password) - that's a
      // small but real security practice.
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // bcrypt.compare scrambles the ATTEMPTED password the same way,
    // then checks if it matches the scrambled one we saved at registration.
    // We never "unscramble" the stored password - that's not how bcrypt works.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};