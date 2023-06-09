const mediaFilesRouter = require("express").Router();

const { mediaFiles } = require("../../controllers");
const { validateBody, authenticate } = require("../../middlewares");
const { mediaFileSchemas } = require("../../models");

//  create a media-file
mediaFilesRouter.post("/add", authenticate, validateBody(mediaFileSchemas.mediaFilesSchema), mediaFiles.addMediaFile);

//  update an own post
mediaFilesRouter.patch(
  "/update/:mediaFileId",
  authenticate,
  validateBody(mediaFileSchemas.updateMediaFilesSchema),
  mediaFiles.updateOwnMediaFile
);

//  get all media-files
mediaFilesRouter.get("/", authenticate, mediaFiles.getAllMediaFiles);

//  get media-file by id
mediaFilesRouter.get("/:mediaFileId", authenticate, mediaFiles.getMediaFileById);

//  delete own media-file
mediaFilesRouter.delete("/remove/:mediaFileId", authenticate, mediaFiles.deleteMediaFile);

module.exports = mediaFilesRouter;
