/**
 * Error handler class
 * @class ErrorHandler
 * @extends {Error}
 * @param {number} statusCode - status code
 * @param {string} message - error message
 * @returns {object} - error object
 * @example
 * throw new ErrorHandler(404, "User not found");
 * throw new ErrorHandler(500, "Server Error");
 * throw new ErrorHandler(400, "Invalid email or password");
 * throw new ErrorHandler(400, "Please add a title");
 * throw new ErrorHandler(400, "Please add a description");
 * throw new ErrorHandler(400, "Please add an email");
 * throw new ErrorHandler(400, "Please add an address");
 */
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super();
        this.statusCode = statusCode;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
