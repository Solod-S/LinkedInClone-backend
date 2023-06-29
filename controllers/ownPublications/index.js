const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addOwnPublication = require("./addOwnPublication");
const deleteOwnPublication = require("./deleteOwnPublication");
const updateOwnPublication = require("./updateOwnPublication");
const getOwnPublication = require("./getOwnPublication");

module.exports = {
  addOwnPublication: ctrlWrapper(addOwnPublication),
  deleteOwnPublication: ctrlWrapper(deleteOwnPublication),
  updateOwnPublication: ctrlWrapper(updateOwnPublication),
  getOwnPublication: ctrlWrapper(getOwnPublication),
};
