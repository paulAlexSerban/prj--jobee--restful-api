const express = require("express");

const router = express.Router();

const { getJobs, newJob, getJobsInRadius, updateJob } = require("../controllers/jobs");

router.route("/api/v1/jobs").get(getJobs);
router.route("/api/v1/job/new").post(newJob);
router.route("/api/v1/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/api/v1/job/:id").put(updateJob);

module.exports = router;
