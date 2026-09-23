import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://spicererp.netlify.app"
];

// ------------------------------------
// Middleware
// ------------------------------------

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

app.use(express.json());

// ------------------------------------
// Root route
// ------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Spicer backend is running."
  });
});

// ------------------------------------
// Health check
// ------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Spicer backend is running."
  });
});

// ------------------------------------
// Authentication routes
// ------------------------------------

app.use("/api/auth", authRoutes);

// ------------------------------------
// Start server
// ------------------------------------

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend on http://localhost:${PORT}`);
      console.log("Allowed frontend origins:");
      console.log(allowedOrigins);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();