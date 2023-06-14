const commentsRouter = require("express").Router();

const { comments } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { commentSchemas } = require("../../models");

//  get own comment
commentsRouter.get("/", authenticate, comments.getAllComments);

//  create a comment
commentsRouter.post("/add", authenticate, validateBody(commentSchemas.commentsSchema), comments.addComment);

//  update an own comment
commentsRouter.patch(
  "/update/:commentId",
  authenticate,
  validateBody(commentSchemas.updateComment),
  comments.updateOwnComment
);

//  delete own comment
commentsRouter.delete("/remove/:commentId", authenticate, comments.deleteOwnComment);

module.exports = commentsRouter;
