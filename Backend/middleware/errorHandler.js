import { sendError } from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let data = null;

  // Handle Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    data = Object.keys(err.keyValue);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with ID: ${err.value}`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${err.name}: ${err.message}`);
    if (statusCode === 500) console.error(err.stack);
  }

  sendError(res, statusCode, message, data);
};

export default errorHandler;
