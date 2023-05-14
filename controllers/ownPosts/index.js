const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getOwnPosts = require("./getOwnPosts");
const addOwnPost = require("./addOwnPost");
const updateOwnPost = require("./updateOwnPost");
const removeOwnPost = require("./removeOwnPost");

module.exports = {
  getOwnPosts: ctrlWrapper(getOwnPosts),
  addOwnPost: ctrlWrapper(addOwnPost),
  updateOwnPost: ctrlWrapper(updateOwnPost),
  removeOwnPost: ctrlWrapper(removeOwnPost),
};
