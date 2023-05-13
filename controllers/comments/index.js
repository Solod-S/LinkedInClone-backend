const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addComment = require("./addComment");

module.exports = {
  addComment: ctrlWrapper(addComment),
};
