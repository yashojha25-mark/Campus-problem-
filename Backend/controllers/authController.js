import { validationResult } from 'express-validator';
import { sendSuccess } from '../utils/apiResponse.js';
import * as authService from '../services/authService.js';

const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.errors = errors.array();
    throw error;
  }
};

export const registerUser = async (req, res, next) => {
  try {
    validateRequest(req);
    const data = await authService.registerUser(req.body);
    sendSuccess(res, 201, 'User registered successfully', data);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    validateRequest(req);
    const data = await authService.loginUser(req.body);
    sendSuccess(res, 200, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const data = { user: authService.buildUserResponse(req.user) };
    sendSuccess(res, 200, 'Current user profile fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'Logout successful. Remove the token from the frontend storage.', null);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    validateRequest(req);
    const user = await authService.updateProfile(req.user._id, req.body);
    sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    validateRequest(req);
    const resetToken = await authService.generatePasswordResetToken(req.body.email);
    
    const responseData = {
      note: 'If an account exists for this email, a reset code has been generated.',
    };

    if (resetToken && process.env.EXPOSE_PASSWORD_RESET_TOKEN === 'true') {
      responseData.resetToken = resetToken;
      responseData.debugNote = 'Reset token is only returned when EXPOSE_PASSWORD_RESET_TOKEN=true (development).';
    }

    sendSuccess(res, 200, 'Password reset requested', responseData);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    validateRequest(req);
    await authService.resetPassword(req.body);
    sendSuccess(res, 200, 'Password updated successfully. You can log in now.', null);
  } catch (error) {
    next(error);
  }
};