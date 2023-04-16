const ctrlWrapper = require("../ctrlWrapper");
const verifyEmail = require("./verifyEmail");
const register = require("./auth");

module.exports = {
  verifyEmail: ctrlWrapper(verifyEmail),
  register: ctrlWrapper(register),
};
