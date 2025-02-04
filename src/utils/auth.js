const jwt = require("jsonwebtoken");

/**
 * Generate a JWT for a user.
 * @param {Object} user - The user object, typically containing id, role, and email.
 * @returns {string} The generated JWT.
 */
const generateToken = (user) => {
  const options = {};
  if (process.env.JWT_EXPIRATION !== "never") {
    options.expiresIn = process.env.JWT_EXPIRATION || "1h";
  }

  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    options
  );
};

/**
 * Verify and decode a JWT.
 * @param {string} token - The JWT to verify.
 * @returns {Object} The decoded payload.
 * @throws Will throw an error if the token is invalid or expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
