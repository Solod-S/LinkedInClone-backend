const ownJobsRouter = require("express").Router();

const { ownJobs } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { JobSchemas } = require("../../models");

//  get own jobs
// ownJobsRouter.get("/", authenticate, ownJobs.getOwnJob);

//  create a new job
ownJobsRouter.post("/add", authenticate, validateBody(JobSchemas.createJobSchema), ownJobs.addOwnJob);

//  update an own job
// ownJobsRouter.patch("/update/:jobId", authenticate, validateBody(JobSchemas.updateJobSchema), ownJobs.updateOwnJob);

//  delete own job
// ownJobsRouter.delete("/remove/:jobId", authenticate, ownJobs.deleteOwnJob);

module.exports = ownJobsRouter;
