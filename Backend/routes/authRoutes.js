import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation rules for signup.
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const profileValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
];

const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
];

const resetPasswordValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('resetToken').trim().notEmpty().withMessage('Reset code is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Public routes do not need a token.
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgot-password', forgotPasswordValidation, requestPasswordReset);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected routes need a valid JWT token.
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.patch('/me', protect, profileValidation, updateProfile);

export default router;