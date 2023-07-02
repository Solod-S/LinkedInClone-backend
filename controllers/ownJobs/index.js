const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getOwnJobs = require("./getOwnJobs");
const addOwnJob = require("./addOwnJob");
const deleteOwnJob = require("./deleteOwnJob");
const updateOwnJob = require("./updateOwnJob");

module.exports = {
  getOwnJobs: ctrlWrapper(getOwnJobs),
  addOwnJob: ctrlWrapper(addOwnJob),
  deleteOwnJob: ctrlWrapper(deleteOwnJob),
  updateOwnJob: ctrlWrapper(updateOwnJob),
};
