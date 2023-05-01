const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const register = require("./register");
const devRegister = require("./devRegister");
const verifyEmail = require("./verifyEmail");
const resendVerifyEmail = require("./resendVerifyEmail");
const devResendVerifyEmail = require("./devResendVerifyEmail");
const login = require("./login");
const getCurrent = require("./getCurrent");
const logout = require("./logout");
const dell = require("./dell");

module.exports = {
  register: ctrlWrapper(register),
  devRegister: ctrlWrapper(devRegister),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  devResendVerifyEmail: ctrlWrapper(devResendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  dell: ctrlWrapper(dell),
};
