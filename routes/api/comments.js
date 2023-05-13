const commentsRouter = require("express").Router();

const { comments } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { commentSchemas } = require("../../models");

//  create a comment
commentsRouter.post("/add", authenticate, validateBody(commentSchemas.commentsSchema), comments.addComment);

//  delete own comment
// commentsRouter.delete("/remove/:coommentId", authenticate, comments.removeLike);

module.exports = commentsRouter;
