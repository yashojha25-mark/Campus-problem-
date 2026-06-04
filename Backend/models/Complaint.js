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
    roomNumber: {
      type: String,
      // only required when type === 'room'
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
