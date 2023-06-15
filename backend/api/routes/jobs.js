const express = require("express");

const router = express.Router();

const { getJobs, newJob, getJobsInRadius, updateJob, deleteJob, getJob, getStats } = require("../controllers/jobs");

router.route("/api/v1/jobs").get(getJobs);
router.route("/api/v1/job/:id/:slug").get(getJob);
router.route("/api/v1/job/new").post(newJob);
router.route("/api/v1/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/api/v1/job/:id").put(updateJob);
router.route("/api/v1/job/:id").delete(deleteJob);
router.route("/api/v1/stats/:topic").get(getStats);

module.exports = router;
