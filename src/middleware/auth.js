const { verifyToken } = require("../utils/auth");

/**
 * Middleware to authenticate users using JWT.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Calls the next middleware function.
 */
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach decoded token data to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

/**
 * Middleware to restrict access to tournament owners.
 */
const isTournamentOwner = (req, res, next) => {
    if (req.user.role !== "tournament_owner" && req.user.role !== "admin") {
        return res.status(403).json({ error: "Access restricted to tournament owners" });
    }
    next();
};

/**
 * Middleware to restrict access to admin users.
 */
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access restricted to administrators" });
    }
    next();
};

module.exports = { authenticate, isTournamentOwner, isAdmin };
