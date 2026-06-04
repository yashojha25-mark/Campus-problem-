import express from 'express';
import { body } from 'express-validator';
import { createContactMessage } from '../controllers/contactController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const contactValidation = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('email').trim().isEmail().withMessage('Please enter a valid email address'),
	body('message')
		.trim()
		.isLength({ min: 6, max: 1000 })
		.withMessage('Message must be between 6 and 1000 characters'),
];

router.post('/', optionalAuth, contactValidation, createContactMessage);

export default router;
