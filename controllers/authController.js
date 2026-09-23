import bcrypt from "bcryptjs";
import User from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Username, email, password, and confirm password are required."
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (
      cleanUsername.length < 3 ||
      cleanUsername.length > 20 ||
      !usernameRegex.test(cleanUsername)
    ) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters and contain only letters, numbers, and underscores."
      });
    }

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
      });
    }

    if (password.length > 64) {
      return res.status(400).json({
        message: "Password cannot exceed 64 characters."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match."
      });
    }

    // -----------------------------
    // Check existing username/email
    // -----------------------------

    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { email: cleanEmail }
      ]
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return res.status(409).json({
          message: "Username already exists."
        });
      }

      if (existingUser.email === cleanEmail) {
        return res.status(409).json({
          message: "Email already exists."
        });
      }

      return res.status(409).json({
        message: "A user with these details already exists."
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------
    // Create user
    // -----------------------------

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword
    });

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.username) {
        return res.status(409).json({
          message: "Username already exists."
        });
      }

      if (error.keyPattern?.email) {
        return res.status(409).json({
          message: "Email already exists."
        });
      }

      return res.status(409).json({
        message: "Username or email already exists."
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const validationMessages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        message: validationMessages[0] || "Invalid user data."
      });
    }

    return res.status(500).json({
      message: "Registration failed due to a server error."
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findOne({
      username: cleanUsername
    }).select("+password");

    // -----------------------------
    // Do not reveal which credential
    // failed
    // -----------------------------

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    // -----------------------------
    // Compare passwords
    // -----------------------------

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    // -----------------------------
    // Successful login
    // -----------------------------

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed due to a server error."
    });
  }
};

export { register, login };