const express = require("express");

const crtl = require("../../controllers/users/auth/auth");

const { validateBody } = require("../../middlewares");

const { schemas } = require("../../models/users/users");

const router = express.Router();

//  sign-up
router.post("/register", validateBody(schemas.registerSchema), crtl.register);

module.exports = router;
