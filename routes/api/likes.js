const likesRouter = require("express").Router();

const { likes } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { likeSchemas } = require("../../models");

//  create/change own like
likesRouter.post("/add", authenticate, validateBody(likeSchemas.createLikeSchema), likes.addLike);

//  delete own like
likesRouter.delete("/remove/:likeId", authenticate, likes.deleteLike);

module.exports = likesRouter;
