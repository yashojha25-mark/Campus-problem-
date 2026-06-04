import express from 'express';
import { body } from 'express-validator';
import { createFeedback, getMyFeedback } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation for feedback submission.
const feedbackValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('descriptionFeedback').trim().notEmpty().withMessage('Feedback description is required'),
  body('complaint').optional().isMongoId().withMessage('Complaint id must be a valid MongoDB id'),
];

router.post('/', protect, feedbackValidation, createFeedback);
router.get('/my', protect, getMyFeedback);

export default router;