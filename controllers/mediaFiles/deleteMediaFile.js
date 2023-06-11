const { MediaFile, Post, Comment } = require("../../models");

const { HttpError } = require("../../routes/errors/HttpErrors");
const { mediaFileTransformer } = require("../../helpers/index");

const deleteMediaFile = async (req, res, next) => {
  const { _id } = req.user;
  const { mediaFileId } = req.params;

  const mediaFile = await MediaFile.findById({ _id: mediaFileId });

  if (!mediaFile || (await mediaFile.owner.toString()) !== _id.toString()) {
    throw HttpError(404, "Not found");
  }

  const result = await MediaFile.findByIdAndDelete({ _id: mediaFileId });

  if (!result) {
    throw HttpError(404, "Not found");
  }


  const model = result.location === "posts"? Post : Comment

  await model.updateOne({ mediaFiles: { $elemMatch: { $eq: mediaFileId } } }, { $pull: { mediaFiles: mediaFileId } });
 
  res.json({
    status: "success",
    message: "Media file successfully deleted",
    data: { mediaFile: mediaFileTransformer(result) },
  });
};

module.exports = deleteMediaFile;
