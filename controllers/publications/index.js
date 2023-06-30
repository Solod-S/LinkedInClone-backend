const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllPublications = require("./getAllPublications");

module.exports = {
  getAllPublications: ctrlWrapper(getAllPublications),
};
