const { MediaFile, Post, Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const addMediaFile = async (req, res, next) => {
  const { _id } = req.user;
const {location} = req.body

const mediaFileId = location === "posts"? req.body.postId : req.body.commentId
const model = location === "posts"? Post : Comment

const mediaFileDestination = await model.findById({ _id: mediaFileId });

if (!mediaFileDestination || (mediaFileDestination.owner.toString()) !== _id.toString()) {
  throw HttpError(404, "Not found");
}

  const newMediaFile = await MediaFile.create({
    ...req.body,
    owner: req.user._id,
  });

  mediaFileDestination.mediaFiles.push(newMediaFile._id);
  await mediaFileDestination.save();

  res.status(201).json({
    status: "success",
    message: "Media file successfully created",
    data: { mediaFile: mediaFileTransformer(newMediaFile) },
  });
};

module.exports = addMediaFile;
