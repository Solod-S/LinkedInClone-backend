const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const getAllUsers = require("./getAllUsers");
const getUsersByQuery = require("./getUsersByQuery");
const getUserById = require("./getUserById");
const userUpdate = require("./userUpdate");
const userDelete = require("./userDelete");

module.exports = {
  getUserById: ctrlWrapper(getUserById),
  getAllUsers: ctrlWrapper(getAllUsers),
  getUsersByQuery: ctrlWrapper(getUsersByQuery),
  userUpdate: ctrlWrapper(userUpdate),
  userDelete: ctrlWrapper(userDelete),
};
