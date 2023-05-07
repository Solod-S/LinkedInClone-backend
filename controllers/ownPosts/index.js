const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getOwnPosts = require("./getOwnPosts");
const addOwnPost = require("./addOwnPost");
const removeOwnPost = require("./removeOwnPost");

module.exports = {
  getOwnPosts: ctrlWrapper(getOwnPosts),
  addOwnPost: ctrlWrapper(addOwnPost),
  removeOwnPost: ctrlWrapper(removeOwnPost),
};
