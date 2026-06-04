import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	// First connect to MongoDB, then start the API server.
	await connectDB();

	// Allow the frontend to call this backend.
	app.use(
		cors({
			origin: process.env.CLIENT_ORIGIN || '*',
			credentials: true,
		})
	);


	// Read JSON data sent from the frontend.
	app.use(express.json());

	// Simple health check route.
	app.get('/', (req, res) => {
		res.json({ message: 'Campus Problems Auth API is running' });
	});

	// All auth routes start with /api/auth.
	app.use('/api/auth', authRoutes);

	// Complaint routes for users to submit and view their complaints.
	app.use('/api/complaints', complaintRoutes);

	// Feedback routes for users to send feedback about a complaint.
	app.use('/api/feedback', feedbackRoutes);

	// If no route matches, return a clear 404 message.
	app.use((req, res) => {
		res.status(404).json({ message: 'Route not found' });
	});

	// Handle unexpected server errors in one place.
	app.use((err, req, res, next) => {
		// Log full error to the console for debugging.
		console.error(err);

		const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
		// In development, include the stack trace in the JSON response to help debugging.
		const responseBody = {
			message: err.message || 'Internal server error',
		};
		if (process.env.NODE_ENV !== 'production') {
			responseBody.stack = err.stack;
		}
		res.status(statusCode).json(responseBody);
	});

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();
