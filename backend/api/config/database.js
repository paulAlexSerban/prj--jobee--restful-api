const mongoose = require("mongoose");
const logger = require("../utils/logger");
const DB_URL = process.env.DB_LOCAL_URI || process.env.DB_URI;

const connectDatabase = () => {
    mongoose
        .connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then((con) => {
            logger.info("Connected to database");
            logger.info(`MongoDB Database connected with host: ${con.connection.host}`);
        })
        .catch((err) => {
            logger.error("Error connecting to database", err);
        });
};

module.exports = connectDatabase;
