import mongoose from 'mongoose';

// Complaint schema stores who submitted, the type, optional room number, and description.
const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Short title/summary of the complaint for quick listing.
    title: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: true,
      // examples: 'room', 'cleaning', 'maintenance', 'other'
    },
    area: {
      type: String,
      enum: ['girls-hostel', 'boys-hostel', 'campus'],
      default: 'campus',
      index: true,
    },
    roomNumber: {
      type: String,
      // only required when type === 'room'
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
      index: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ area: 1, status: 1 });

export default mongoose.model('Complaint', complaintSchema);
