const authenticate = require("./auth");
const validateBody = require("./validateBody");
const ctrlWrapper = require("./ctrlWrapper");
const isAdminMiddleware = require("./isAdminMiddleware");
const gPassport = require("./google-authenticate");
const lPassport = require("./linkedIn-authenticate");
module.exports = {
  authenticate,
  validateBody,
  ctrlWrapper,
  isAdminMiddleware,
  gPassport,
  lPassport,
};
