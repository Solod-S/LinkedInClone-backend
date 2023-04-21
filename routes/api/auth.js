const express = require("express");

const crtl = require("../../controllers");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/users");

const router = express.Router();

//  sign-up
router.post("/register", validateBody(schemas.registerSchema), crtl.users.register);
router.get("/verify/:verificationCode", crtl.users.verifyEmail);
// router.post("/verify", validateBody(schemas.emailSchema), crtl.resendVerifyEmail);

//  sign-in
router.post("/login", validateBody(schemas.loginSchema), crtl.users.login);

//  chek user
router.get("/current", authenticate, crtl.users.getCurrent);
// logout
router.get("/logout", authenticate, crtl.users.logout);

module.exports = router;
