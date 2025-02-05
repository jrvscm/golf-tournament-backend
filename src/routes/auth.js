const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const { generateToken } = require("../utils/auth");
const { User, Organization } = require("../models");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

/**
 * 🎯 Register a Tournament Owner & Organization
 */
router.post(
  "/register/organization",
  [
    body("organizationName").notEmpty().withMessage("Organization name is required"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { organizationName, fullName, email, password } = req.body;

    try {
      // Check if organization already exists
      const existingOrganization = await Organization.findOne({ where: { name: organizationName } });
      if (existingOrganization) {
        return res.status(400).json({ error: "Organization name already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate a verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      // Generate API key (or Organization ID)
      const apiKey = crypto.randomBytes(16).toString("hex");

      // Create Organization
      const organization = await Organization.create({
        name: organizationName,
        id: apiKey, // Unique identifier for the organization
      });

      // Create Tournament Owner User
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "tournament_owner",
        status: "pending",
        organizationId: organization.id,
        verificationToken
      });

      // Generate JWT token
      const token = generateToken(user);

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Ensures secure cookies in production
        sameSite: "Strict", // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
        ...(process.env.NODE_ENV === 'production' && { domain: 'netlify.domain' }),
        path: '/',
      });

        // Set up Nodemailer transporter for production
        const transporter = process.env.NODE_ENV === 'development' ? {} : nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS, 
          },
      });

      // Construct the verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/backend/auth/verify/${verificationToken}`;
      if (process.env.NODE_ENV === 'development') {
          console.log(verificationUrl);
      } else {
          const mailOptions = {
              from: 'jarvis@highplainsmedia.com', // Sender address
              to: email, // Recipient email
              subject: 'Verify Your Account',
              text: `Welcome to ${organizationName}! Please verify your account by clicking the following link: ${verificationUrl}`,
              html: `<p>Welcome to ${organizationName}!</p>
                  <p>Please verify your account by clicking the link below:</p>
                  <a href="${verificationUrl}">${verificationUrl}</a>`,
          };

          // Send the email
          await transporter.sendMail(mailOptions);
      }

      res.status(201).json({
        message: "Organization registered successfully!",
        token,
        organizationId: organization.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register organization" });
    }
  }
);

/**
 * 🎯 Log in a Tournament Owner
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

      const token = generateToken(user);

      res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to log in user" });
    }
  }
);

/**
 * 🎯 Organization ID-Based Tournament Access
 */
router.post(
  "/organization-access",
  [body("organizationId").notEmpty().withMessage("Organization ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId } = req.body;

    try {
      // Check if the organization exists
      const organization = await Organization.findByPk(organizationId);
      if (!organization) {
        return res.status(404).json({ error: "Invalid Organization ID" });
      }

      res.status(200).json({
        message: "Organization ID verified",
        organizationId: organization.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to verify Organization ID" });
    }
  }
);

/**
 * 🎯 Get Tournament Owner Profile
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: Organization });

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
router.post("/logout", authenticate, (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});

/**
 * Verify a user's account using a token.
 */
router.get('/verify/:token', async (req, res) => {
  try {
      const { token } = req.params;

      // Fetch user based on verification token
      const user = await User.findOne({ where: { verificationToken: token } });

      if (!user) {
          return res.redirect(`${process.env.FRONTEND_URL}/verification?failed=1`);
      }

      // Verify user
      user.status = 'verified';
      user.verificationToken = null;
      await user.save();

      const updatedToken = generateToken({
          id: user.id,
          role: user.role,
          organizationId: user.organizationId,
          status: user.status,
      });

      // Set authentication token in HTTP-only cookie
      res.cookie('token', updatedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          ...(process.env.NODE_ENV === 'production' && { domain: 'netlify.domain' }),
          maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
          path: '/',
      });

      // ✅ Handle Redirect Based on Role
      let redirectUrl;
      if (user.role === 'tournament_owner' || user.role === 'admin' && organizationId) {
          redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
      } else {
          redirectUrl = `${process.env.FRONTEND_URL}/tournaments`;
      }

      return res.redirect(redirectUrl);

  } catch (err) {
      console.error("Error verifying user:", err);

      // ✅ Ensure `user` exists before accessing `role`
      const fallbackRole = err?.user?.role || 'guest';
      
      const redirectUrl =
          fallbackRole === 'rewards_user'
              ? `${process.env.FRONTEND_URL}/tournaments/signin`
              : `${process.env.FRONTEND_URL}/signin`;

      return res.redirect(redirectUrl);
  }
});


module.exports = router;
