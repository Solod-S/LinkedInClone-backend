const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addMediaFile = require("./addMediaFile");
const updateOwnMediaFile = require("./updateOwnMediaFile");
const getAllMediaFiles = require("./getAllMediaFiles");
const getMediaFileById = require("./getMediaFileById");
const deleteMediaFile = require("./deleteMediaFile");

module.exports = {
  addMediaFile: ctrlWrapper(addMediaFile),
  getAllMediaFiles: ctrlWrapper(getAllMediaFiles),
  updateOwnMediaFile: ctrlWrapper(updateOwnMediaFile),
  getMediaFileById: ctrlWrapper(getMediaFileById),
  deleteMediaFile: ctrlWrapper(deleteMediaFile),
};
