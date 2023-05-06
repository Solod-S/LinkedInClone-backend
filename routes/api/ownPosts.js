const ownPostsRouter = require("express").Router();

const { ownPosts } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { postSchemas } = require("../../models");

ownPostsRouter.post("/add", authenticate, validateBody(postSchemas.myPostSchema), ownPosts.addNewPost);

module.exports = ownPostsRouter;
