import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  getAdminMe,
  getAdminOverview,
  getAdminComplaints,
  getAdminFeedback,
  getAdminUsers,
  deleteAdminUser,
  getAdminContactMessages,
  updateContactMessageStatus,
  updateComplaintStatus,
} from '../controllers/adminController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Admin username is required'),
  body('password').notEmpty().withMessage('Admin password is required'),
];

const statusValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .bail()
    .isIn(['pending', 'in-progress', 'resolved'])
    .withMessage('Status must be pending, in-progress, or resolved'),
];

const contactStatusValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .bail()
    .isIn(['new', 'read', 'archived'])
    .withMessage('Status must be new, read, or archived'),
];

router.post('/login', loginValidation, adminLogin);
router.get('/me', adminProtect, getAdminMe);
router.get('/overview', adminProtect, getAdminOverview);
router.get('/complaints', adminProtect, getAdminComplaints);
router.get('/feedback', adminProtect, getAdminFeedback);
router.get('/users', adminProtect, getAdminUsers);
router.get('/contact', adminProtect, getAdminContactMessages);
router.patch('/complaints/:id/status', adminProtect, statusValidation, updateComplaintStatus);
router.patch('/contact/:id/status', adminProtect, contactStatusValidation, updateContactMessageStatus);
router.delete('/users/:id', adminProtect, deleteAdminUser);

export default router;