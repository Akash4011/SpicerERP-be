import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ------------------------------------
// Middleware
// ------------------------------------

app.use(
  cors({
    origin: CLIENT_URL
  })
);

app.use(express.json());

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
      console.log(`Backend running on http://localhost:${PORT}`);
      console.log(`Frontend allowed by CORS: ${CLIENT_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();


// github is tested