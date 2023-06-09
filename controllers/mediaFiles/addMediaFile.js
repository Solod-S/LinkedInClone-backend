const { MediaFile, Post, Comment, Education, Experience, Publication, Company } = require("../../models");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const addMediaFile = async (req, res, next) => {
  const { _id } = req.user;
  const { location } = req.body;
  let mediaFileId = "";
  let model = null;

  switch (location) {
    case "posts":
      mediaFileId = req.body.postId;
      model = Post;
      break;
    case "comments":
      mediaFileId = req.body.commentId;
      model = Comment;
      break;
    case "education":
      mediaFileId = req.body.educationId;
      model = Education;
      break;
    case "experience":
      mediaFileId = req.body.experienceId;
      model = Experience;
      break;
    case "publications":
      mediaFileId = req.body.publicationId;
      model = Publication;
      break;
    default:
      break;
  }

  const mediaFileDestination = await model.findById({ _id: mediaFileId });

  if (!mediaFileDestination) {
    throw HttpError(404, "Not found");
  }

  const company = await Company.findById({ _id: mediaFileDestination.owner });

  if (
    !mediaFileDestination || location !== "publications"
      ? mediaFileDestination.owner.toString() !== _id.toString()
      : !company.owners.includes(new ObjectId(_id))
  ) {
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
