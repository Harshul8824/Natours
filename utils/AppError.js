// Create a custom error class that extends the built-in Error class
class AppError extends Error {

    constructor(message, statusCode) {
        // Call parent Error constructor to set the message
        super(message);

        // Store the HTTP status code (e.g., 404, 500)
        this.statusCode = statusCode;

        // Set status based on the type of error
        // 4xx → 'fail' (client error)
        // 5xx → 'error' (server error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Mark this error as operational (expected/handled)
        this.isOperational = true;

        //This trims the stack trace so it doesn’t include the error-handling infrastructure — only the actual location where error was thrown.
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the class for use in other files
module.exports = AppError;
