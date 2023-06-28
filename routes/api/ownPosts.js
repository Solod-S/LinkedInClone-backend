const ownPostsRouter = require("express").Router();

const { ownPosts } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { postSchemas } = require("../../models");

//  get own posts
ownPostsRouter.get("/", authenticate, ownPosts.getOwnPosts);

//  create a new post
ownPostsRouter.post("/add", authenticate, validateBody(postSchemas.createPostSchema), ownPosts.addOwnPost);

//  update an own post
ownPostsRouter.patch(
  "/update/:postId",
  authenticate,
  validateBody(postSchemas.updatecreatePostSchema),
  ownPosts.updateOwnPost
);

//  delete own post
ownPostsRouter.delete("/remove/:postId", authenticate, ownPosts.deleteOwnPost);

module.exports = ownPostsRouter;
