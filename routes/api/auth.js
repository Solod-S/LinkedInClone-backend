const express = require("express");

const { users } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/users");

const router = express.Router();

//  sign-up
router.post("/register", validateBody(schemas.registerSchema), users.register);
router.get("/verify/:verificationCode", users.verifyEmail);
router.post("/verify", validateBody(schemas.emailSchema), users.resendVerifyEmail);

//  sign-in
router.post("/login", validateBody(schemas.loginSchema), users.login);

//  chek user
router.get("/current", authenticate, users.getCurrent);

// logout
router.get("/logout", authenticate, users.logout);

// dell-user
router.delete("/dell", authenticate, users.dell);

// dev
router.post("/devregister", validateBody(schemas.registerSchema), users.devRegister);
router.post("/devverify", validateBody(schemas.emailSchema), users.devResendVerifyEmail);

module.exports = router;
