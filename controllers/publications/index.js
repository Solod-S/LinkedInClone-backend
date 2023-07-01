const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllPublications = require("./getAllPublications");
const getPopularPublications = require("./getPopularPublications");
const getPublicationsByQuery = require("./getPublicationsByQuery");
const getPublicationById = require("./getPublicationById");

module.exports = {
  getAllPublications: ctrlWrapper(getAllPublications),
  getPopularPublications: ctrlWrapper(getPopularPublications),
  getPublicationsByQuery: ctrlWrapper(getPublicationsByQuery),
  getPublicationById: ctrlWrapper(getPublicationById),
};
