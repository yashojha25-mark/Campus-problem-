import { validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';

const createContactMessage = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
		}

		const { name, email, message } = req.body;
		const contactMessage = await ContactMessage.create({
			user: req.user?._id,
			name,
			email,
			message,
		});

		return res.status(201).json({
			message: 'Message sent successfully. We will reply within 24 hours.',
			contactMessage,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Could not send message', error: error.message });
	}
};

export { createContactMessage };
