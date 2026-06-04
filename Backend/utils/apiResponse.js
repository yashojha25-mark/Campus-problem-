/**
 * Sends a standard success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Payload
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standard error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} data - Additional error info
 */
export const sendError = (res, statusCode = 500, message = 'Internal Server Error', data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};
