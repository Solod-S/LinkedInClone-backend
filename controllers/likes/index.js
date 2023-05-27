const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const addLike = require("./addLike");
const deleteLike = require("./deleteLike");

module.exports = {
  addLike: ctrlWrapper(addLike),
  deleteLike: ctrlWrapper(deleteLike),
};
