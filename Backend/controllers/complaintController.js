import { validationResult } from 'express-validator';
import { sendSuccess } from '../utils/apiResponse.js';
import * as complaintService from '../services/complaintService.js';

const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.errors = errors.array();
    throw error;
  }
};

export const createComplaint = async (req, res, next) => {
  try {
    validateRequest(req);
    const complaint = await complaintService.createComplaint(req.user._id, req.body, req.file);
    sendSuccess(res, 201, 'Complaint submitted', { complaint });
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getMyComplaints(req.user._id);
    sendSuccess(res, 200, 'Complaints fetched successfully', { complaints });
  } catch (error) {
    next(error);
  }
};
