const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllJobs = require("./getAllJobs");
const getPopularJobs = require("./getPopularJobs");
const getAppliedJobs = require("./getAppliedJobs");
const getJobsByQuery = require("./getJobsByQuery");
const getJobById = require("./getJobById");
const applyJobById = require("./applyJobById");
const unApplyJobById = require("./unApplyJobById");

module.exports = {
  getAllJobs: ctrlWrapper(getAllJobs),
  getPopularJobs: ctrlWrapper(getPopularJobs),
  getAppliedJobs: ctrlWrapper(getAppliedJobs),
  getJobsByQuery: ctrlWrapper(getJobsByQuery),
  getJobById: ctrlWrapper(getJobById),
  applyJobById: ctrlWrapper(applyJobById),
  unApplyJobById: ctrlWrapper(unApplyJobById),
};
