const ctrlWrapper = require("../ctrlWrapper");
const verifyEmail = require("./verifyEmail");
const register = require("./register");

module.exports = {
  verifyEmail: ctrlWrapper(verifyEmail),
  register: ctrlWrapper(register),
};
