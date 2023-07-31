const authRouter = require("express").Router();

const { auth } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { userSchemas, refreshSchema } = require("../../models");

//  google auth
authRouter.get("/google", auth.googleAuth);
authRouter.get("/google-redirect", auth.googleRedirect);

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
