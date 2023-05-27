const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllComments = require("./getAllComments");
const addComment = require("./addComment");
const updateOwnComment = require("./updateOwnComment");
const deleteOwnComment = require("./deleteOwnComment");

module.exports = {
  getAllComments: ctrlWrapper(getAllComments),
  addComment: ctrlWrapper(addComment),
  updateOwnComment: ctrlWrapper(updateOwnComment),
  deleteOwnComment: ctrlWrapper(deleteOwnComment),
};
