import { validationResult } from 'express-validator';
import { sendSuccess } from '../utils/apiResponse.js';
import * as feedbackService from '../services/feedbackService.js';

const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.errors = errors.array();
    throw error;
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    validateRequest(req);
    const feedback = await feedbackService.createFeedback(req.user._id, req.body);
    sendSuccess(res, 201, 'Feedback submitted', { feedback });
  } catch (error) {
    next(error);
  }
};

export const getMyFeedback = async (req, res, next) => {
  try {
    const feedbacks = await feedbackService.getMyFeedback(req.user._id);
    sendSuccess(res, 200, 'Feedback fetched successfully', { feedbacks });
  } catch (error) {
    next(error);
  }
};