const authenticate = require("./auth");
const validateBody = require("./validateBody");
const ctrlWrapper = require("./ctrlWrapper");
const isAdminMiddleware = require("./isAdminMiddleware");
const gPassport = require("./google-authenticate");
const lPassport = require("./linkedIn-authenticate");
const fPassport = require("./facebook-authenticate");
const gitPassport = require("./github-authenticate");

module.exports = {
  authenticate,
  validateBody,
  ctrlWrapper,
  isAdminMiddleware,
  gPassport,
  lPassport,
  fPassport,
  gitPassport,
};
