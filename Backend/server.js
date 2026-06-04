import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import helmet from 'helmet';

import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandler from './middleware/errorHandler.js';

import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';

import complaintRoutes from './routes/complaintRoutes.js';

import feedbackRoutes from './routes/feedbackRoutes.js';

import contactRoutes from './routes/contactRoutes.js';

import adminRoutes from './routes/adminRoutes.js';

import { authRateLimiter } from './middleware/rateLimiters.js';

import { contactRateLimiter } from './middleware/rateLimiters.js';



dotenv.config();



const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const adminPanelPath = path.join(__dirname, '..', 'AdminPannel');

const uploadsPath = path.join(__dirname, 'uploads');



const PORT = process.env.PORT || 5000;

let server;



const startServer = async () => {

	if (!process.env.JWT_SECRET) {

		console.error('JWT_SECRET is required in .env');

		process.exit(1);

	}



	await connectDB();



	const allowedOrigins = new Set(

		[

			process.env.CLIENT_ORIGIN,

			'http://localhost:5000',

			'http://localhost:5173',

			'http://localhost:5500',

			'http://127.0.0.1:5000',

			'http://127.0.0.1:5173',

			'http://127.0.0.1:5500',

		].filter(Boolean)

	);



	app.use(helmet({

		crossOriginResourcePolicy: { policy: 'cross-origin' },

	}));

	app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));



	app.use(

		cors({

			origin(origin, callback) {

				if (!origin || origin === 'null' || allowedOrigins.has(origin)) {

					return callback(null, true);

				}

				if (process.env.NODE_ENV !== 'production') {

					try {

						const { hostname } = new URL(origin);

						if (hostname === 'localhost' || hostname === '127.0.0.1') {

							return callback(null, true);

						}

					} catch {

						// Fall through to the rejection below.

					}

				}



				return callback(new Error(`Not allowed by CORS: ${origin}`));

			},

			credentials: true,

		})

	);



	app.use(express.json({ limit: '1mb' }));
	app.use(express.urlencoded({ extended: true, limit: '1mb' }));
	app.use((req, res, next) => {
		Object.defineProperty(req, 'query', {
			value: { ...req.query },
			writable: true,
			configurable: true,
			enumerable: true,
		});
		next();
	});
	app.use(mongoSanitize());
	app.use('/uploads', express.static(uploadsPath));



	app.get('/api/health', (req, res) => {

		res.status(200).json({

			status: 'ok',

			uptime: process.uptime(),

			database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',

			timestamp: new Date().toISOString(),

		});

	});



	app.get('/', (req, res) => {

		res.json({ message: 'Campus Problems API is running' });

	});



	app.use('/api/auth', authRateLimiter, authRoutes);

	app.use('/api/complaints', complaintRoutes);

	app.use('/api/feedback', feedbackRoutes);

	app.use('/api/contact', contactRateLimiter, contactRoutes);

	app.use('/api/admin', adminRoutes);



	app.use('/admin', express.static(adminPanelPath));

	app.get('/admin', (req, res) => {

		res.sendFile(path.join(adminPanelPath, 'index.html'));

	});



	app.use((req, res) => {
		res.status(404).json({ success: false, message: 'Route not found', data: null });
	});

	app.use(errorHandler);



	server = app.listen(PORT, () => {

		console.log(`Server running on port ${PORT}`);

	});

};



const shutdown = async (signal) => {

	console.log(`${signal} received. Shutting down gracefully...`);



	if (server) {

		await new Promise((resolve) => {

			server.close(resolve);

		});

	}



	await mongoose.connection.close();

	process.exit(0);

};



process.on('SIGINT', () => shutdown('SIGINT'));

process.on('SIGTERM', () => shutdown('SIGTERM'));



startServer().catch((error) => {

	console.error('Failed to start server:', error.message);

	process.exit(1);

});


