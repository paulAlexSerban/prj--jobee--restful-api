const logger = require("../utils/logger");
const Job = require("../models/jobs");
const geocoder = require("../utils/geocoder");
// Get all jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
    logger.info(`GET /api/v1/jobs`);
    try {
        const jobs = await Job.find();
        res.status(200).json({
            success: true,
            requestMethod: req.requestMethod,
            requestTime: req.requestTime,
            message: "GET /api/v1/jobs - This route will display all jobs in the future",
            results: jobs.length,
            data: jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
            error: error.message,
        });
    }
};

// Create new job => /api/v1/jobs
exports.newJob = async (req, res, next) => {
    logger.info(`POST /api/v1/job/new`);
    try {
        const job = await Job.create(req.body);
        res.status(200).json({
            success: true,
            message: "POST /api/v1/job/new - Job Created",
            data: job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
            error: error.message,
        });
    }
};

// search jobs within radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
    logger.info(`GET /api/v1/jobs/:zipcode/:distance`);
    const { zipcode, distance } = req.params;

    try {
        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;
        // Calc radius using radians
        // Divide dist by radius of Earth
        // Earth Radius = 3,963 mi / 6,378 km
        const radius = distance / 3963;
        const jobs = await Job.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius],
                },
            },
        });
        res.status(200).json({
            success: true,
            message: `GET /api/v1/jobs/:zipcode/:distance - Jobs within ${distance} miles of ${zipcode}`,
            results: jobs.length,
            data: jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
            error: error.message,
        });
    }
};

// update job => /api/v1/jobs/:id
exports.updateJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: "No job found",
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            message: `PUT /api/v1/jobs/:id - Job updated`,
            data: job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
            error: error.message,
        });
    }
};
