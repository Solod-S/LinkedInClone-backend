const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addNewPost = require("./addNewPost");

module.exports = {
  addNewPost: ctrlWrapper(addNewPost),
};
