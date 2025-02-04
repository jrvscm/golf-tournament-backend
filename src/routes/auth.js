const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const { generateToken } = require("../utils/auth");
const { User } = require("../models");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 🎯 Register a Tournament Owner
 */
router.post(
  "/register/owner",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create the user as a Tournament Owner
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "tournament_owner",
        status: "pending",
        verificationToken,
      });

      // Generate JWT token
      const token = generateToken(user);

      res.status(201).json({ message: "Tournament Owner registered successfully!", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register tournament owner" });
    }
  }
);

/**
 * 🎯 Register a Player
 */
router.post(
  "/register/player",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user as a Player
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "player",
        status: "verified",
      });

      // Generate JWT token
      const token = generateToken(user);

      res.status(201).json({ message: "Player registered successfully!", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register player" });
    }
  }
);

/**
 * 🎯 Log in a User
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if user is verified
      if (user.status !== "verified") {
        return res.status(403).json({ error: "Account not verified" });
      }

      const token = generateToken(user);

      res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to log in user" });
    }
  }
);

/**
 * 🎯 Get Logged-In User Profile
 */
router.get("/profile", authenticate.authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
});

/**
 * 🎯 Log out a User
 */
router.post("/logout", authenticate.authenticate, (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});

module.exports = router;
