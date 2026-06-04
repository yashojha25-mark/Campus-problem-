import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

// Remove the password before sending user data back to the frontend.
const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Create a JWT token after login.
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async (req, res) => {
  try {
    // Check if the request body passes the validation rules.
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Prevent duplicate accounts with the same email.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Save the new user. The password will be hashed by the model.
    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Check validation again before trying to log the user in.
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors.array(),
      });
    }

    const { email, password } = req.body;

    // Find the user and include the password field only for login check.
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database.
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send a token back to the frontend after successful login.
    const token = createToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    message: 'Current user profile fetched successfully',
    user: buildUserResponse(req.user),
  });
};

const logoutUser = async (req, res) => {
  // JWT logout happens on the frontend by deleting the stored token.
  return res.status(200).json({
    message: 'Logout successful. Remove the token from the frontend storage.',
  });
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};