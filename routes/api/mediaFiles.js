const mediaFilesRouter = require("express").Router();

const { mediaFiles } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { mediaFileSchemas } = require("../../models");

//  create a media-file
mediaFilesRouter.post("/add", authenticate, validateBody(mediaFileSchemas.mediaFilesSchema), mediaFiles.addMediaFile);

//  get all media-files
mediaFilesRouter.get("/", authenticate, mediaFiles.getAllMediaFiles);

//  delete own media-file
mediaFilesRouter.delete("/remove/:mediaFileId", authenticate, mediaFiles.removeMediaFile);

module.exports = mediaFilesRouter;
