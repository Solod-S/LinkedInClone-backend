const authRouter = require("express").Router();

const { auth } = require("../../controllers");
const { validateBody, authenticate, gPassport, lPassport, fPassport, gitPassport } = require("../../middlewares");
const { userSchemas, refreshSchema } = require("../../models");

//  google passport auth
authRouter.get("/google", gPassport.authenticate("google", { scope: ["email", "profile"] }));
authRouter.get("/google-redirect", gPassport.authenticate("google", { session: false }), auth.googlePassportAuth);

//  google auth v2
// authRouter.get("/google", auth.googleAuth);
// authRouter.get("/google-redirect", auth.googleRedirect);

// linkedin passport auth
authRouter.get(
  "/linkedin",
  lPassport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);
authRouter.get("/linkedin-redirect", lPassport.authenticate("linkedin", { session: false }), auth.linkedInPassportAuth);

// github passport auth
authRouter.get("/github", gitPassport.authenticate("github", { scope: ["email", "profile"] }));
authRouter.get("/github-redirect", gitPassport.authenticate("github", { session: false }), auth.githubPassportAuth);

// facebook passport auth
authRouter.get("/facebook", fPassport.authenticate("facebook", { scope: ["email"] }));
authRouter.get("/facebook-redirect", fPassport.authenticate("facebook", { session: false }), auth.facebookAuth);

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
