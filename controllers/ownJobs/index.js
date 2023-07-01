const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addOwnJob = require("./addOwnJob");

module.exports = {
  addOwnJob: ctrlWrapper(addOwnJob),
};
