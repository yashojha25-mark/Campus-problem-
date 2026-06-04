import { validationResult } from 'express-validator';
import Feedback from '../models/Feedback.js';

// Create feedback for a complaint.
const createFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { complaint, name, email, title, descriptionFeedback } = req.body;

    const feedback = await Feedback.create({
      user: req.user._id,
      complaint: complaint || undefined,
      name,
      email,
      title,
      descriptionFeedback,
    });

    return res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    return res.status(500).json({ message: 'Could not submit feedback', error: error.message });
  }
};

// Get feedback submitted by the logged-in user.
const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ feedbacks });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch feedback', error: error.message });
  }
};

export { createFeedback, getMyFeedback };