const jobsRouter = require("express").Router();

const { jobs } = require("../../controllers");
const { authenticate } = require("../../middlewares");

//  get all jobs
jobsRouter.get("/", authenticate, jobs.getAllJobs);

//  get popular jobs
jobsRouter.get("/popular", authenticate, jobs.getPopularJobs);

// search jobs by query
jobsRouter.get("/search", authenticate, jobs.getJobsByQuery);

// get job by id
jobsRouter.get("/:jobId", authenticate, jobs.getJobById);

// apply job by id
jobsRouter.get("/apply/:jobId", authenticate, jobs.applyJobById);

// unapply job by id
jobsRouter.get("/unapply/:jobId", authenticate, jobs.unApplyJobById);

module.exports = jobsRouter;
