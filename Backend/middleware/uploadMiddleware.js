import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const complaintsUploadDir = path.join(__dirname, '..', 'uploads', 'complaints');

if (!fs.existsSync(complaintsUploadDir)) {
	fs.mkdirSync(complaintsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, complaintsUploadDir);
	},
	filename(req, file, cb) {
		const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
		const safeExtension = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extension)
			? extension
			: '.jpg';
		cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
	},
});

const imageFilter = (req, file, cb) => {
	const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
	if (allowed.includes(file.mimetype)) {
		cb(null, true);
		return;
	}
	cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'));
};

export const uploadComplaintPhoto = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: imageFilter,
}).single('photo');

export const handleUploadError = (err, req, res, next) => {
	if (!err) {
		return next();
	}

	if (err.code === 'LIMIT_FILE_SIZE') {
		return res.status(400).json({ message: 'Image must be 5 MB or smaller' });
	}

	return res.status(400).json({ message: err.message || 'File upload failed' });
};
