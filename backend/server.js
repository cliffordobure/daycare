import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";  
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/default.js";

// Import models (required for Mongoose populate operations)
import "./models/User.js";
import "./models/Center.js";
import "./models/Child.js";
import "./models/Activity.js";
import "./models/Attendance.js";
import "./models/Communication.js";
import "./models/HealthRecord.js";
import "./models/Payment.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import centerRoutes from "./routes/centers.js";
import childRoutes from "./routes/children.js";
import classRoutes from "./routes/classes.js";
import attendanceRoutes from "./routes/attendance.js";
import activityRoutes from "./routes/activities.js";
import paymentRoutes from "./routes/payments.js";
import communicationRoutes from "./routes/communication.js";
import healthRoutes from "./routes/health.js";
import reportRoutes from "./routes/reports.js";
import dashboardRoutes from "./routes/dashboard.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { authenticateToken } from "./middleware/auth.js";

// Import socket handlers
import { initializeSocket } from "./socket/socketHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"],
  },
});

// Initialize socket handlers (only if JWT secret is configured)
if (
  config.jwtSecret &&
  config.jwtSecret !== "your-super-secret-jwt-key-change-this-in-production"
) {
  try {
    initializeSocket(io);
    console.log("Socket.IO handlers initialized successfully");
  } catch (error) {
    console.warn("Failed to initialize Socket.IO handlers:", error.message);
  }
} else {
  console.warn(
    "Socket.IO handlers not initialized - JWT secret not configured"
  );
}

// CORS - More permissive for development (must be first)
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? config.frontendUrl 
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static files    
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Nurtura API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/centers", centerRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/children", authenticateToken, childRoutes);
app.use("/api/classes", authenticateToken, classRoutes);
app.use("/api/attendance", authenticateToken, attendanceRoutes);
app.use("/api/activities", authenticateToken, activityRoutes);
app.use("/api/payments", authenticateToken, paymentRoutes);
app.use("/api/communication", authenticateToken, communicationRoutes);
app.use("/api/health", authenticateToken, healthRoutes);
app.use("/api/reports", authenticateToken, reportRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.warn("Make sure MongoDB is running on your system");
    console.warn("You can install MongoDB or use MongoDB Atlas");
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(config.port, () => {
      console.log(`🚀 Nurtura Server running on port ${config.port}`);
      console.log(`📱 Frontend URL: ${config.frontendUrl}`);
      console.log(
        `🔌 Socket.IO: ${
          config.jwtSecret !==
          "your-super-secret-jwt-key-change-this-in-production"
            ? "Initialized"
            : "Not configured"
        }`
      );
      console.log(
        `📧 Email Service: ${
          config.email.user ? "Configured" : "Not configured"
        }`
      );
      console.log(
        `📱 SMS Service: ${
          config.twilio.accountSid ? "Configured" : "Not configured"
        }`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
    mongoose.connection.close();
  });
});

export default app;
