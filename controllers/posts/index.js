const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllPosts = require("./getAllPosts");
const getPostById = require("./getPostById");
const getPostsByQuery = require("./getPostsByQuery");

module.exports = {
  getAllPosts: ctrlWrapper(getAllPosts),
  getPostById: ctrlWrapper(getPostById),
  getPostsByQuery: ctrlWrapper(getPostsByQuery),
};
