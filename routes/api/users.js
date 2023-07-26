const usersRouter = require("express").Router();

const { users } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { userSchemas } = require("../../models");

//  update user
usersRouter.patch("/update", authenticate, validateBody(userSchemas.userUpdateSchema), users.userUpdate);

// del-user
usersRouter.delete("/remove", authenticate, users.userDelete);

// get all users
usersRouter.get("/", authenticate, users.getAllUsers);

// search user by query
usersRouter.get("/search", authenticate, users.getUsersByQuery);

// get user by id
usersRouter.get("/:userId", authenticate, users.getUserById);

module.exports = usersRouter;
