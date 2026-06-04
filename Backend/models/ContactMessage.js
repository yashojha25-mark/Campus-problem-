import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			index: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ['new', 'read', 'archived'],
			default: 'new',
			index: true,
		},
	},
	{ timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
