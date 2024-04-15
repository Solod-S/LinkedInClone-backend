const authRouter = require("express").Router();

const { auth } = require("../../controllers");
const {
  validateBody,
  authenticate,
  gPassport,
  twitterPassport,
  lPassport,
  fPassport,
  gitPassport,
  instagramAuthRedirect,
  instagramAuth,
} = require("../../middlewares");
const { userSchemas, refreshSchema } = require("../../models");

//  instagram auth
// https://localhost:3000/auth/instagram
authRouter.get("/instagram", instagramAuthRedirect);
authRouter.get("/instagram-redirect", instagramAuth, auth.instagramAuth);

//  twitter passport auth
// https://localhost:3000/auth/twitter
authRouter.get("/twitter", twitterPassport.authenticate("twitter", { scope: ["email", "profile"] }));
authRouter.get(
  "/twitter-redirect",
  twitterPassport.authenticate("twitter", { session: false }),
  auth.twitterPassportAuth
);

//  google passport auth
// https://localhost:3000/auth/google
authRouter.get("/google", gPassport.authenticate("google", { scope: ["email", "profile"] }));
authRouter.get("/google-redirect", gPassport.authenticate("google", { session: false }), auth.googlePassportAuth);

//  google auth v2
// authRouter.get("/google", auth.googleAuth);
// authRouter.get("/google-redirect", auth.googleRedirect);

// linkedin passport auth
// https://localhost:3000/auth/linkedin
authRouter.get(
  "/linkedin",
  lPassport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);
authRouter.get("/linkedin-redirect", lPassport.authenticate("linkedin", { session: false }), auth.linkedInPassportAuth);

// github passport auth
// https://localhost:3000/auth/github
authRouter.get("/github", gitPassport.authenticate("github", { scope: ["email", "profile"] }));
authRouter.get("/github-redirect", gitPassport.authenticate("github", { session: false }), auth.githubPassportAuth);

// facebook passport auth
// https://localhost:3000/auth/facebook
authRouter.get("/facebook", fPassport.authenticate("facebook", { scope: ["email"] }));
authRouter.get("/facebook-redirect", fPassport.authenticate("facebook", { session: false }), auth.facebookPassportAuth);

//  sign-up
authRouter.post("/register", validateBody(userSchemas.registerSchema), auth.userRegister);
authRouter.get("/verify/:verificationCode", auth.verifyEmail);
authRouter.post("/verify", validateBody(userSchemas.emailSchema), auth.resendVerifyEmail);

//  sign-in
authRouter.post("/login", validateBody(userSchemas.loginSchema), auth.userLogin);

//  refresh token
authRouter.post("/refresh", validateBody(refreshSchema), auth.userRefreshToken);

//  chek user
authRouter.get("/current", authenticate, auth.getCurrent);

// change password
authRouter.post("/password-change", validateBody(userSchemas.passwordChangeSchema), authenticate, auth.passwordChange);

//  send password-reser link by email
authRouter.post("/password-reset", validateBody(userSchemas.passwordResetRequestSchema), auth.passwordResetByEmail);

//  restore password
authRouter.post("/password-reset/:resetToken", validateBody(userSchemas.passwordRestoreSchema), auth.passwordReset);

// logout
authRouter.get("/logout", authenticate, auth.userLogout);

// dev endpoints
authRouter.post("/devregister", validateBody(userSchemas.registerSchema), auth.devRegister);
authRouter.post("/devverify", validateBody(userSchemas.emailSchema), auth.devResendVerifyEmail);

module.exports = authRouter;
