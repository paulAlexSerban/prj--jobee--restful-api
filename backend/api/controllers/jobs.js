const logger = require("../utils/logger");
const Job = require("../models/jobs");
const geocoder = require("../utils/geocoder");
const ErrorHandler = require("../utils/ErrorHandler");
const isValidObjectId = require("../utils/isValidObjectId");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFilters = require("../utils/ApiFilters");
/**
 * Get all jobs
 * @route GET /api/v1/jobs
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @description This route will display all jobs in the future
 * @example http://localhost:3000/api/v1/jobs
 */
exports.getJobs = catchAsyncErrors(async (req, res, next) => {
    const { query, requestMethod, requestTime } = req;
    logger.info(`GET /api/v1/jobs`);
    const apiFilters = new APIFilters(Job.find(), query).filter().sort().limitFields().paginate().searchByQuery();
    const jobs = await apiFilters.query;
    res.status(200).json({
        success: true,
        requestMethod: requestMethod,
        requestTime: requestTime,
        message: "GET /api/v1/jobs - This route will display all jobs in the future",
        results: jobs.length,
        data: jobs,
    });
});

/**
 * Get job by id and slug
 * @route GET /api/v1/job/:id/:slug
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @description This route will display a single job by id and slug
 * @example http://localhost:5000/api/v1/job/5f7f6d5f6d5f6d5f6d5f6d5f/this-is-a-test-job
 */
exports.getJob = catchAsyncErrors(async (req, res, next) => {
    logger.info(`GET /api/v1/job/:id/:slug`);
    const { id, slug } = req.params;
    if (!isValidObjectId(id)) {
        return next(new ErrorHandler(`Invalid job id: ${id}`, 400));
    }
    const job = await Job.find({ $and: [{ _id: id }, { slug: slug }] });
    if (!job || job.length === 0) {
        return res.status(404).json({
            success: false,
            error: "No job found",
        });
    }
    res.status(200).json({
        success: true,
        requestMethod: req.requestMethod,
        requestTime: req.requestTime,
        message: "GET /api/v1/job/:id/:slug - This route will display a single job by id and slug",
        data: job,
    });
});

/**
 * Create new job
 * @route POST /api/v1/jobs
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @description This route will create a new job
 */
exports.newJob = catchAsyncErrors(async (req, res, next) => {
    logger.info(`POST /api/v1/job/new`);
    const job = await Job.create(req.body);
    res.status(200).json({
        success: true,
        message: "POST /api/v1/job/new - Job Created",
        data: job,
    });
});

/**
 * Get jobs within a radius
 * @route GET /api/v1/jobs/:zipcode/:distance
 * @param {*} req - request object
 * @param {*} res - response object
 * @param {*} next - next middleware
 */
exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
    logger.info(`GET /api/v1/jobs/:zipcode/:distance`);
    const { zipcode, distance } = req.params;

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
});

/**
 * Update a job
 * @route PUT /api/v1/jobs/:id
 * @param {*} req - request object
 * @param {*} res - response object
 * @param {*} next - next middleware
 * @returns - response object
 */

exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(new ErrorHandler(`Invalid job id: ${id}`, 400));
    }

    let job = await Job.findById(id);

    if (!job) {
        return next(new ErrorHandler(`Job not found with id of ${id}`, 404));
    }

    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: `PUT /api/v1/job/:id - Job updated`,
        data: job,
    });
});

/**
 * Delete a job
 * @route DELETE /api/v1/job/:id
 * @param {*} req - request object
 * @param {*} res - response object
 * @param {*} next - next middleware
 * @returns - response object
 */
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(new ErrorHandler(`Invalid job id: ${id}`, 400));
    }
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
        return next(new ErrorHandler(`Job not found with id of ${id}`, 404));
    }
    res.status(200).json({
        success: true,
        message: `DELETE /api/v1/jobs/:id - Job deleted`,
        data: {},
    });
});

/**
 * Get stats about a topic(job) (how many jobs, how many in a month, etc)
 * @route GET /api/v1/stats/:topic
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns - response object
 * @description This route will get stats about a topic(job) (how many jobs, how many in a month, etc)
 * @example GET /api/v1/stats/node
 * @example GET /api/v1/stats/react
 */
exports.getStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: { $text: { $search: '"' + req.params.topic + '"' } },
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: [{ $type: "$experience" }, "string"] },
                        then: { $toUpper: "$experience" },
                        else: "$experience",
                    },
                },
                totalJobs: { $sum: 1 },
                avgPosition: { $avg: "$positions" },
                avgSalary: { $avg: "$salary" },
                minSalary: { $min: "$salary" },
                maxSalary: { $max: "$salary" },
            },
        },
    ]);
    if (stats.length === 0) {
        return next(new ErrorHandler(`No stats found for ${req.params.topic}`, 200));
    }
    res.status(200).json({
        success: true,
        message: `GET /api/v1/stats/:topic - Stats for ${req.params.topic}`,
        data: stats,
    });
});
