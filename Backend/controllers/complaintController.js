import { validationResult } from 'express-validator';
import Complaint from '../models/Complaint.js';

// Create a new complaint. User must be authenticated (middleware attaches req.user).
const createComplaint = async (req, res) => {
  try {
    // Check validation results from the route validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, title, type, roomNumber, description } = req.body;

    // Save complaint and link it to the logged-in user
    const complaint = await Complaint.create({
      user: req.user._id,
      name,
      title,
      email,
      type,
      roomNumber: roomNumber || undefined,
      description,
    });

    return res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (error) {
    return res.status(500).json({ message: 'Could not submit complaint', error: error.message });
  }
};

// Get complaints for the currently logged-in user
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ complaints });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch complaints', error: error.message });
  }
};

export { createComplaint, getMyComplaints };
