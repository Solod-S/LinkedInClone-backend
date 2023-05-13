const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addLike = require("./addLike");
const removeLike = require("./removeLike");

module.exports = {
  addLike: ctrlWrapper(addLike),
  removeLike: ctrlWrapper(removeLike),
};
