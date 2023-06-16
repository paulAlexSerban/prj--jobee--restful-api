const express = require("express");
const logger = require("./utils/logger");

const connectDatabase = require("./config/database");
const errorMiddleware = require("./middlewares/errors");
// importing all routes
const jobs = require("./routes/jobRoutes");
const ErrorHandler = require("./utils/ErrorHandler");

const app = express();
app.use(express.json()); // set json parser

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
    logger.error(`Error: ${err.message}`);
    logger.info("Shutting down the server due to Uncaught Exception");
    process.exit(1);
});

const dbConnect = connectDatabase();
logger.info("Starting server...");

app.use("/api/v1", jobs);

// handle unhandled routes
app.all("*", (req, res, next) => {
    logger.error(`Route not found: ${req.originalUrl}`);
    next(new ErrorHandler(`Route not found: ${req.originalUrl}`, 404));
});

// middleware to handle errors
app.use(errorMiddleware);
// set communication endpoint
const PORT = process.env.API_PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const server = app.listen(PORT, HOSTNAME, () => {
    console.log(`Listen to requests on port http://${HOSTNAME}:${PORT}`);
});

// handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error(`Error: ${err.message}`);
    logger.info("Shutting down the server due to Unhandled Promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
