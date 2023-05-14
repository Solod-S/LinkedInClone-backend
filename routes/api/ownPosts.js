const ownPostsRouter = require("express").Router();

const { ownPosts } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { postSchemas } = require("../../models");

//  get own posts
ownPostsRouter.get("/", authenticate, ownPosts.getOwnPosts);

//  create a new post
ownPostsRouter.post("/add", authenticate, validateBody(postSchemas.myPostSchema), ownPosts.addOwnPost);

//  update an own post
ownPostsRouter.patch(
  "/update/:postId",
  authenticate,
  validateBody(postSchemas.updateMyPostSchema),
  ownPosts.updateOwnPost
);

//  delete own post
ownPostsRouter.delete("/remove/:postId", authenticate, ownPosts.removeOwnPost);

module.exports = ownPostsRouter;
