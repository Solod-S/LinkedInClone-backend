const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllComments = require("./getAllComments");
const addComment = require("./addComment");
const updateOwnComment = require("./updateOwnComment");
const removeOwnComment = require("./removeOwnComment");

module.exports = {
  getAllComments: ctrlWrapper(getAllComments),
  addComment: ctrlWrapper(addComment),
  updateOwnComment: ctrlWrapper(updateOwnComment),
  removeOwnComment: ctrlWrapper(removeOwnComment),
};
