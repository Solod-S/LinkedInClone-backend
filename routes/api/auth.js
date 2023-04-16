const express = require("express");

const crtl = require("../../controllers");

const { validateBody } = require("../../middlewares");

const { schemas } = require("../../models/users");

const router = express.Router();

//  sign-up
router.post("/register", validateBody(schemas.registerSchema), crtl.users.register);

//  verify
router.get("/verify/:verificationCode", crtl.users.verifyEmail);

module.exports = router;
