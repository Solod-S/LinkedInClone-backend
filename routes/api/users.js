const usersRouter = require("express").Router();

const { users } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { userSchemas } = require("../../models");

//  sign-up
usersRouter.post("/register", validateBody(userSchemas.registerSchema), users.userRegister);
usersRouter.get("/verify/:verificationCode", users.verifyEmail);
usersRouter.post("/verify", validateBody(userSchemas.emailSchema), users.resendVerifyEmail);

//  sign-in
usersRouter.post("/login", validateBody(userSchemas.loginSchema), users.userLogin);

//  chek user
usersRouter.get("/current", authenticate, users.getCurrent);

// change password
usersRouter.post(
  "/password-change",
  validateBody(userSchemas.passwordChangeSchema),
  authenticate,
  users.passwordChange
);

//  send password-reser link by email
usersRouter.post("/password-reset", validateBody(userSchemas.passwordResetRequestSchema), users.passwordResetByEmail);

//  restore password
usersRouter.post("/password-reset/:resetToken", validateBody(userSchemas.passwordRestoreSchema), users.passwordReset);

//  update user
usersRouter.patch("/update", authenticate, validateBody(userSchemas.userUpdateSchema), users.userUpdate);

// logout
usersRouter.get("/logout", authenticate, users.userLogout);

// del-user
usersRouter.delete("/remove", authenticate, users.userDelete);

// get all users
usersRouter.get("/", authenticate, users.getAllUsers);

// search user by query
usersRouter.get("/search", authenticate, users.getUsersByQuery);

// get user by id
usersRouter.get("/:userId", authenticate, users.getUserById);

// dev endpoints
usersRouter.post("/devregister", validateBody(userSchemas.registerSchema), users.devRegister);
usersRouter.post("/devverify", validateBody(userSchemas.emailSchema), users.devResendVerifyEmail);

module.exports = usersRouter;
