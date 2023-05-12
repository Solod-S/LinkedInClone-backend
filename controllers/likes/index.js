const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addLike = require("./addLike");

module.exports = {
  addLike: ctrlWrapper(addLike),
};
