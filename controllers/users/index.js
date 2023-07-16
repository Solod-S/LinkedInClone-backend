const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const userRegister = require("./userRegister");
const devRegister = require("./devRegister");
const verifyEmail = require("./verifyEmail");
const resendVerifyEmail = require("./resendVerifyEmail");
const devResendVerifyEmail = require("./devResendVerifyEmail");
const userLogin = require("./userLogin");
const getCurrent = require("./getCurrent");
const getAllUsers = require("./getAllUsers");
const getUsersByQuery = require("./getUsersByQuery");
const getUserById = require("./getUserById");
const userLogout = require("./userLogout");
const passwordChange = require("./passwordChange");
const passwordResetByEmail = require("./passwordResetByEmail");
const passwordReset = require("./passwordReset");
const userUpdate = require("./userUpdate");
const userDelete = require("./userDelete");

module.exports = {
  userRegister: ctrlWrapper(userRegister),
  devRegister: ctrlWrapper(devRegister),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  devResendVerifyEmail: ctrlWrapper(devResendVerifyEmail),
  userLogin: ctrlWrapper(userLogin),
  getCurrent: ctrlWrapper(getCurrent),
  getUserById: ctrlWrapper(getUserById),
  getAllUsers: ctrlWrapper(getAllUsers),
  getUsersByQuery: ctrlWrapper(getUsersByQuery),
  userLogout: ctrlWrapper(userLogout),
  passwordChange: ctrlWrapper(passwordChange),
  passwordResetByEmail: ctrlWrapper(passwordResetByEmail),
  passwordReset: ctrlWrapper(passwordReset),
  userUpdate: ctrlWrapper(userUpdate),
  userDelete: ctrlWrapper(userDelete),
};
