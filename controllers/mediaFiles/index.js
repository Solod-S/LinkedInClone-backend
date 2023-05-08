const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addMediaFile = require("./addMediaFile");
const getAllMediaFiles = require("./getAllMediaFiles");

module.exports = {
  addMediaFile: ctrlWrapper(addMediaFile),
  getAllMediaFiles: ctrlWrapper(getAllMediaFiles),
};
