const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addMediaFile = require("./addMediaFile");
const getAllMediaFiles = require("./getAllMediaFiles");
const getMediaFileById = require("./getMediaFileById");
const removeMediaFile = require("./removeMediaFile");

module.exports = {
  addMediaFile: ctrlWrapper(addMediaFile),
  getAllMediaFiles: ctrlWrapper(getAllMediaFiles),
  getMediaFileById: ctrlWrapper(getMediaFileById),
  removeMediaFile: ctrlWrapper(removeMediaFile),
};
