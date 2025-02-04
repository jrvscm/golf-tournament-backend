const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/config/swagger");
const childProcess = require("child_process");
const { Server } = require("socket.io");
const http = require("http");

// Import routes
const tournamentRoutes = require("./src/routes/tournaments");
const playerRoutes = require("./src/routes/players");
const scoreRoutes = require("./src/routes/scores");
const authRoutes = require("./src/routes/auth");

// require("./src/jobs");

dotenv.config();

// PostgreSQL Startup for Local Dev
if (process.env.NODE_ENV === "development") {
  try {
    childProcess.execSync("pg_ctl -D /usr/local/var/postgresql@14 status", {
      stdio: "ignore",
    });
    console.log("PostgreSQL is already running.");
  } catch {
    try {
      childProcess.execSync("pg_ctl -D /usr/local/var/postgresql@14 start", {
        stdio: "ignore",
      });
      console.log("Starting PostgreSQL...");
    } catch (err) {
      console.error("Failed to start PostgreSQL:", err.message);
      process.exit(1);
    }
  }
}

// Initialize Express & HTTP Server
const app = express();
const server = http.createServer(app);

// Trust Proxy for Heroku
app.set("trust proxy", 1);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://your-netlify-app.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  path: "/socket.io",
});

// Attach Socket.IO to Express
app.set("io", io);
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

// Stripe Webhooks Middleware
app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/webhooks/stripe")) {
        req.rawBody = buf.toString(); // Preserve raw body for Stripe
      }
    },
  })
);

// Rate Limiting (Prevents API abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit per IP
  message: { error: "Too many requests, please try again later." },
  keyGenerator: (req) => req.ip,
});
app.use(limiter);

// CORS Configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://your-netlify-app.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Register API Documentation
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Register Routes
// app.use("/tournaments", tournamentRoutes);
// app.use("/players", playerRoutes);
// app.use("/scores", scoreRoutes);
app.use("/auth", authRoutes);

// Start the Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
