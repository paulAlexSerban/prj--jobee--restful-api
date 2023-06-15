const express = require("express");
const logger = require("./utils/logger");
const connectDatabase = require("./config/database");

// importing all routes
const jobs = require("./routes/jobs");

const app = express();
const dbConnect = connectDatabase();
logger.info("Starting server...");

// set json parser
app.use(express.json());

app.use(jobs)

// set communication endpoint
const PORT = process.env.NODE_PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

app.listen(PORT, HOSTNAME, () => {
    console.log(`Listen to requests on port http://${HOSTNAME}:${PORT}`);
});
