const { MediaFile, Post, Comment, Education, Experience, Publication, Company, User } = require("../../models");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const { HttpError } = require("../../routes/errors/HttpErrors");
const { transformers } = require("../../helpers/index");

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
    case "users":
      mediaFileId = req.body.userId;
      model = User;
      break;
    case "companies":
      mediaFileId = req.body.companyId;
      model = Company;
      break;
    default:
      break;
  }

  const mediaFileDestination = await model.findById({ _id: mediaFileId });

  if (!mediaFileDestination) {
    throw HttpError(404, "Not found");
  }

  if (location !== "users") {
    const company =
      location !== "companies" ? await Company.findById({ _id: mediaFileDestination.owner }) : mediaFileDestination;

    if (
      !mediaFileDestination || (location !== "publications" && location !== "companies")
        ? mediaFileDestination.owner.toString() !== _id.toString()
        : !company.owners.includes(new ObjectId(_id))
    ) {
      throw HttpError(404, "Not found");
    }
  } else {
    if (mediaFileDestination.id.toString() !== _id.toString()) {
      throw HttpError(404, "Not found");
    }
  }

  const newMediaFile = await MediaFile.create({
    ...req.body,
    owner: req.user._id,
  });

  if (
    (location === "users" && mediaFileDestination.avatarURL) ||
    (location === "companies" && mediaFileDestination.avatarURL)
  ) {
    await MediaFile.findByIdAndDelete({ _id: mediaFileDestination.avatarURL._id });
  }
  location !== "users" && location !== "companies"
    ? mediaFileDestination.mediaFiles.push(newMediaFile._id)
    : (mediaFileDestination.avatarURL = newMediaFile._id);
  await mediaFileDestination.save();

  res.status(201).json({
    status: "success",
    message: "Media file successfully created",
    data: { mediaFile: transformers.mediaFileTransformer(newMediaFile) },
  });
};

module.exports = addMediaFile;
