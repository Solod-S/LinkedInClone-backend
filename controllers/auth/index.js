const ctrlWrapper = require("../ctrlWrapper");
const verifyEmail = require("./verifyEmail");
const register = require("./register");
const login = require("./login");

module.exports = {
  verifyEmail: ctrlWrapper(verifyEmail),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
