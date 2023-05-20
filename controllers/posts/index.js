const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllPosts = require("./getAllPosts");
const getPopularPosts = require("./getPopularPosts");
const getPostById = require("./getPostById");
const getPostsByQuery = require("./getPostsByQuery");

module.exports = {
  getAllPosts: ctrlWrapper(getAllPosts),
  getPopularPosts: ctrlWrapper(getPopularPosts),
  getPostById: ctrlWrapper(getPostById),
  getPostsByQuery: ctrlWrapper(getPostsByQuery),
};
