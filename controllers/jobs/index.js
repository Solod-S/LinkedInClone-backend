const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllJobs = require("./getAllJobs");
const getPopularJobs = require("./getPopularJobs");
const getJobsByQuery = require("./getJobsByQuery");
const getJobById = require("./getJobById");
const applyJobById = require("./applyJobById");
const unApplyJobById = require("./unApplyJobById");

module.exports = {
  getAllJobs: ctrlWrapper(getAllJobs),
  getPopularJobs: ctrlWrapper(getPopularJobs),
  getJobsByQuery: ctrlWrapper(getJobsByQuery),
  getJobById: ctrlWrapper(getJobById),
  applyJobById: ctrlWrapper(applyJobById),
  unApplyJobById: ctrlWrapper(unApplyJobById),
};
