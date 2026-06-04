import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Complaint from '../models/Complaint.js';
import ContactMessage from '../models/ContactMessage.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const allowedAreas = ['girls-hostel', 'boys-hostel', 'campus'];
const allowedStatuses = ['pending', 'in-progress', 'resolved'];
const allowedTypes = [
  'room', 'electricity', 'dining-hall', 'cleaning', 'maintenance', 'other',
  'water-leakage', 'fan-not-working', 'electricity-issues', 'wifi-issues',
  'cleanliness-concerns', 'furniture-damage',
];
const campusAreaFilter = {
  $or: [
    { area: 'campus' },
    { area: { $exists: false } },
    { area: null },
  ],
};
const pendingStatusFilter = {
  $or: [
    { status: 'pending' },
    { status: { $exists: false } },
    { status: null },
  ],
};

const createAdminToken = () => jwt.sign(
  {
    role: 'admin',
    username: process.env.ADMIN_USERNAME,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  }
);

const adminLogin = async (req, res) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors.array(),
      });
    }

    const { username, password } = req.body;

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ message: 'Admin credentials are not configured in .env' });
    }

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin username or password' });
    }

    return res.status(200).json({
      message: 'Admin login successful',
      token: createAdminToken(),
      admin: {
        username,
        role: 'admin',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
};

const getAdminMe = async (req, res) => {
  return res.status(200).json({
    message: 'Admin profile fetched successfully',
    admin: req.admin,
  });
};

const getAdminOverview = async (req, res) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      girlsHostelComplaints,
      boysHostelComplaints,
      campusComplaints,
      totalUsers,
      totalFeedback,
      totalContactMessages,
      newContactMessages,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments(pendingStatusFilter),
      Complaint.countDocuments({ status: 'in-progress' }),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ area: 'girls-hostel' }),
      Complaint.countDocuments({ area: 'boys-hostel' }),
      Complaint.countDocuments(campusAreaFilter),
      User.countDocuments(),
      Feedback.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
    ]);

    return res.status(200).json({
      summary: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        girlsHostelComplaints,
        boysHostelComplaints,
        campusComplaints,
        totalUsers,
        totalFeedback,
        totalContactMessages,
        newContactMessages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load admin overview', error: error.message });
  }
};

const getAdminComplaints = async (req, res) => {
  try {
    const { area, status, type } = req.query;
    const filter = {};

    if (area && allowedAreas.includes(area)) {
      if (area === 'campus') {
        filter.$or = campusAreaFilter.$or;
      } else {
        filter.area = area;
      }
    }

    if (status && allowedStatuses.includes(status)) {
      if (status === 'pending') {
        filter.$and = filter.$and || [];
        filter.$and.push(pendingStatusFilter);
      } else {
        filter.status = status;
      }
    }

    if (type && allowedTypes.includes(type)) {
      filter.type = type;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      complaints,
      filters: {
        area: filter.area || 'all',
        status: filter.status || 'all',
        type: filter.type || 'all',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch admin complaints', error: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    const updatePayload = {
      status,
      resolvedAt: status === 'resolved' ? new Date() : null,
    };

    const complaint = await Complaint.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.status(200).json({
      message: 'Complaint status updated successfully',
      complaint,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update complaint status', error: error.message });
  }
};

const getAdminFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('complaint', 'title area status');

    return res.status(200).json({ feedbacks });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch feedback records', error: error.message });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email createdAt updatedAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch users', error: error.message });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's complaints and feedback too
    await Promise.all([
      Complaint.deleteMany({ user: id }),
      Feedback.deleteMany({ user: id }),
    ]);

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete user', error: error.message });
  }
};

const getAdminContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch contact messages', error: error.message });
  }
};

const updateContactMessageStatus = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    return res.status(200).json({
      message: 'Contact message updated successfully',
      contactMessage: message,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update contact message', error: error.message });
  }
};

export {
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
};