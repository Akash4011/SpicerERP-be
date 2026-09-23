import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const CLIENT_URL = "https://spicererp.netlify.app";

// ------------------------------------
// Middleware
// ------------------------------------

app.use(
  cors({
    origin: CLIENT_URL
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
      console.log("Spicer backend started successfully.");
      console.log(`Port: ${PORT}`);
      console.log(`CORS allowed origin: ${CLIENT_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();