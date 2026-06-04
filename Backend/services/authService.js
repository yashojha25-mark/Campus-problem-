import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw Object.assign(new Error('Email already exists'), { statusCode: 400 });
  }

  const user = await User.create({ name, email, password });
  const token = createToken(user._id);

  return { token, user: buildUserResponse(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const token = createToken(user._id);
  return { token, user: buildUserResponse(user) };
};

export const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  return buildUserResponse(user);
};

export const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashResetToken(resetToken);
  user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  return resetToken;
};

export const resetPassword = async ({ email, resetToken, password }) => {
  const hashedToken = hashResetToken(resetToken);
  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw Object.assign(new Error('Invalid or expired reset code'), { statusCode: 400 });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};
