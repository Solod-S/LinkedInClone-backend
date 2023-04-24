const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const verifyEmail = require("./verifyEmail");
const register = require("./register");
const devRegister = require("./devRegister");
const login = require("./login");
const getCurrent = require("./getCurrent");
const logout = require("./logout");
const dell = require("./dell");

module.exports = {
  verifyEmail: ctrlWrapper(verifyEmail),
  register: ctrlWrapper(register),
  devRegister: ctrlWrapper(devRegister),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  dell: ctrlWrapper(dell),
};
