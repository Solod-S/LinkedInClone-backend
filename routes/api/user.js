const userRouter = require("express").Router();

const { users } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { userSchemas } = require("../../models");

//  sign-up
userRouter.post("/register", validateBody(userSchemas.registerSchema), users.register);
userRouter.get("/verify/:verificationCode", users.verifyEmail);
userRouter.post("/verify", validateBody(userSchemas.emailSchema), users.resendVerifyEmail);

//  sign-in
userRouter.post("/login", validateBody(userSchemas.loginSchema), users.login);

//  chek user
userRouter.get("/current", authenticate, users.getCurrent);

// logout
userRouter.get("/logout", authenticate, users.logout);

// del-user
userRouter.delete("/del", authenticate, users.del);

// dev
userRouter.post("/devregister", validateBody(userSchemas.registerSchema), users.devRegister);
userRouter.post("/devverify", validateBody(userSchemas.emailSchema), users.devResendVerifyEmail);

module.exports = userRouter;
