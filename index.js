import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();