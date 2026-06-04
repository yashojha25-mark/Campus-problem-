import express from 'express';
import { body } from 'express-validator';
import { createComplaint, getMyComplaints } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadComplaintPhoto, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Allowed complaint types — extend as needed.
const allowedTypes = ['room', 'electricity', 'dining-hall', 'cleaning', 'maintenance', 'other'];
const allowedAreas = ['girls-hostel', 'boys-hostel', 'campus'];

// Validation rules for creating a complaint
const createValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .isIn(allowedTypes)
    .withMessage(`Type must be one of: ${allowedTypes.join(', ')}`),
  body('area')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(allowedAreas)
    .withMessage(`Area must be one of: ${allowedAreas.join(', ')}`),
  // Custom validator: require roomNumber only if type === 'room'.
  // Be defensive: if req.body is missing, do not throw here — other validators will report missing fields.
  body('roomNumber').custom((value, { req }) => {
    const type = req && req.body ? req.body.type : undefined;
    if (type !== 'room') return true; // roomNumber only required for room type
    if (!value || String(value).trim() === '') {
      throw new Error('Room number is required when type is room');
    }
    return true;
  }),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// POST /api/complaints - create a new complaint (protected, optional photo)
router.post(
	'/',
	protect,
	(req, res, next) => {
		uploadComplaintPhoto(req, res, (error) => {
			if (error) {
				return handleUploadError(error, req, res, next);
			}
			return next();
		});
	},
	createValidation,
	createComplaint
);

// GET /api/complaints/my - get complaints for current user (protected)
router.get('/my', protect, getMyComplaints);

export default router;
