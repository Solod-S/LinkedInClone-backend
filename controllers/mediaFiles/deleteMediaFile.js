const { MediaFile, Post, Comment, Education, Experience } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const deleteMediaFile = async (req, res, next) => {
  const { _id } = req.user;
  const { mediaFileId } = req.params;
  console.log(mediaFileId);

  const mediaFile = await MediaFile.findById({ _id: mediaFileId });

  if (!mediaFile || (await mediaFile.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await MediaFile.findByIdAndDelete({ _id: mediaFileId });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  let model = null;
  console.log(result.location);
  switch (result.location) {
    case "posts":
      model = Post;
      break;
    case "comments":
      model = Comment;
      break;
    case "education":
      model = Education;
      break;
    case "experience":
      model = Experience;
      break;
    default:
      break;
  }

  await model.updateOne({ mediaFiles: { $elemMatch: { $eq: mediaFileId } } }, { $pull: { mediaFiles: mediaFileId } });

  res.json({
    status: "success",
    message: "Media file successfully deleted",
    data: { mediaFile: mediaFileTransformer(result) },
  });
};

module.exports = deleteMediaFile;
