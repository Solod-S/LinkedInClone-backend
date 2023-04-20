const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const verifyEmail = require("./verifyEmail");
const register = require("./register");
const login = require("./login");
const getCurrent = require("./getCurrent");

module.exports = {
  verifyEmail: ctrlWrapper(verifyEmail),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
};
