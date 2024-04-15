const authenticate = require("./auth");
const validateBody = require("./validateBody");
const ctrlWrapper = require("./ctrlWrapper");
const isAdminMiddleware = require("./isAdminMiddleware");
const gPassport = require("./google-authenticate");
const twitterPassport = require("./twitter-authenticate");
const lPassport = require("./linkedIn-authenticate");
const fPassport = require("./facebook-authenticate");
const gitPassport = require("./github-authenticate");
const instagramAuthRedirect = require("./instagramAuthRedirect");
const instagramAuth = require("./instagram-authenticate");

module.exports = {
  authenticate,
  validateBody,
  ctrlWrapper,
  isAdminMiddleware,
  instagramAuthRedirect,
  instagramAuth,
  gPassport,
  twitterPassport,
  lPassport,
  fPassport,
  gitPassport,
};
