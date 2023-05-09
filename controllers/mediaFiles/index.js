const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addMediaFile = require("./addMediaFile");
const getAllMediaFiles = require("./getAllMediaFiles");
const removeMediaFile = require("./removeMediaFile");

module.exports = {
  addMediaFile: ctrlWrapper(addMediaFile),
  getAllMediaFiles: ctrlWrapper(getAllMediaFiles),
  removeMediaFile: ctrlWrapper(removeMediaFile),
};
