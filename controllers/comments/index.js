const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addComment = require("./addComment");
const updateOwnComment = require("./updateOwnComment");
const removeOwnComment = require("./removeOwnComment");

module.exports = {
  addComment: ctrlWrapper(addComment),
  updateOwnComment: ctrlWrapper(updateOwnComment),
  removeOwnComment: ctrlWrapper(removeOwnComment),
};
