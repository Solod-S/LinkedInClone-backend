const likesRouter = require("express").Router();

const { likes } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { likeSchemas } = require("../../models");

//  create a media-file
likesRouter.post("/add", authenticate, validateBody(likeSchemas.LikesSchema), likes.addLike);

module.exports = likesRouter;
