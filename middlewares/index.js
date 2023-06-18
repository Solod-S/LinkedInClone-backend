const authenticate = require("./auth");
const validateBody = require("./validateBody");
const ctrlWrapper = require("./ctrlWrapper");
const isAdminMiddleware = require("./isAdminMiddleware");

// const cloudinary = require("./cloudinary");
// const upload = require("./multer");
module.exports = {
  authenticate,
  validateBody,
  ctrlWrapper,
  isAdminMiddleware,
  // cloudinary,
  // upload
};
