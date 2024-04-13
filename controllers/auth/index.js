const ctrlWrapper = require("../../middlewares/ctrlWrapper");
const googleAuth = require("./googleAuth");
const googleRedirect = require("./googleRedirect");
const googlePassportAuth = require("./googlePassportAuth");
const linkedInPassportAuth = require("./linkedInPassportAuth");
const facebookPassportAuth = require("./facebookPassportAuth");
const githubPassportAuth = require("./githubPassportAuth");
const userRegister = require("./userRegister");
const devRegister = require("./devRegister");
const verifyEmail = require("./verifyEmail");
const resendVerifyEmail = require("./resendVerifyEmail");
const devResendVerifyEmail = require("./devResendVerifyEmail");
const userLogin = require("./userLogin");
const userRefreshToken = require("./userRefreshToken");
const getCurrent = require("./getCurrent");
const userLogout = require("./userLogout");
const passwordChange = require("./passwordChange");
const passwordResetByEmail = require("./passwordResetByEmail");
const passwordReset = require("./passwordReset");
const instagramAuth = require("./instagramAuth");

module.exports = {
  googlePassportAuth: ctrlWrapper(googlePassportAuth),
  linkedInPassportAuth: ctrlWrapper(linkedInPassportAuth),
  googleAuth: ctrlWrapper(googleAuth),
  facebookPassportAuth: ctrlWrapper(facebookPassportAuth),
  githubPassportAuth: ctrlWrapper(githubPassportAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
  userRegister: ctrlWrapper(userRegister),
  devRegister: ctrlWrapper(devRegister),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  devResendVerifyEmail: ctrlWrapper(devResendVerifyEmail),
  userLogin: ctrlWrapper(userLogin),
  userRefreshToken: ctrlWrapper(userRefreshToken),
  getCurrent: ctrlWrapper(getCurrent),
  userLogout: ctrlWrapper(userLogout),
  passwordChange: ctrlWrapper(passwordChange),
  passwordResetByEmail: ctrlWrapper(passwordResetByEmail),
  passwordReset: ctrlWrapper(passwordReset),
  instagramAuth: ctrlWrapper(instagramAuth),
};
